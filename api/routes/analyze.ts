import express, { type Request, type Response, type NextFunction } from 'express'
import { diffLines, createTwoFilesPatch } from 'diff'
import { aiAnalyze } from '../services/ai.ts'

const router = express.Router()

interface AnalyzeRequest {
  oldCode: string
  newCode: string
}

interface AnalyzePayload {
  score: number
  hallucinations: string[]
  reasoning: string
  risks: string[]
  diff_summary: {
    added: number
    removed: number
    modified: number
  }
  low_confidence_lines: number[]
  safe_patch: string
  raw_diff: string
}

interface AnalyzeResponse {
  success: boolean
  data: AnalyzePayload | null
}

router.post(
  '/',
  async (req: Request<unknown, unknown, AnalyzeRequest>, res: Response<AnalyzeResponse>, next: NextFunction): Promise<void> => {
    try {
      const { oldCode, newCode } = req.body
      if (typeof oldCode !== 'string' || typeof newCode !== 'string') {
        res.status(400).json({ success: false, data: null })
        return
      }

      const raw_diff = createTwoFilesPatch('old', 'new', oldCode, newCode)
      const lineDiff = diffLines(oldCode, newCode)

      let added = 0
      let removed = 0
      let modified = 0
      const lowConfidence: number[] = []

      let newLineCursor = 1
      for (const part of lineDiff) {
        const count = part.count ?? part.value.split('\n').length - 1
        if (part.added) {
          added += count
          for (let i = 0; i < count; i++) {
            lowConfidence.push(newLineCursor + i)
          }
          newLineCursor += count
        } else if (part.removed) {
          removed += count
        } else {
          newLineCursor += count
        }
      }

      modified = Math.min(added, removed)

      const risks = detectRisks(oldCode, newCode)
      const hallucinations = detectHallucinations(oldCode, newCode)

      const aiResult = await aiAnalyze({ oldCode, newCode, risks, hallucinations, raw_diff })

      const allRisks = Array.from(new Set([...(aiResult.risks || []), ...risks]))
      const allHallucinations = Array.from(new Set([...(aiResult.hallucinations || []), ...hallucinations]))

      const score = computeReliabilityScore({
        oldCode,
        newCode,
        added,
        removed,
        modified,
        risks: allRisks,
        hallucinations: allHallucinations,
      })

      const safe_patch = buildSafePatch(oldCode, newCode)

      res.status(200).json({
        success: true,
        data: {
          score,
          hallucinations: allHallucinations,
          reasoning: aiResult.reasoning || 'Heuristic analysis completed',
          risks: allRisks,
          diff_summary: { added, removed, modified },
          low_confidence_lines: lowConfidence.slice(0, 200),
          safe_patch,
          raw_diff,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

function tokenize(code: string): string[] {
  return Array.from(
    new Set(
      (code.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []).filter((t) => !reserved.has(t)),
    ),
  )
}

const reserved = new Set<string>([
  'const','let','var','function','return','if','else','for','while','switch','case','break','continue','try','catch','finally','class','new','this','import','from','export','default','extends','super','await','async','yield','throw','true','false','null','undefined','in','instanceof','typeof','delete','void','with','do','of','as'
])

function detectHallucinations(oldCode: string, newCode: string): string[] {
  const hallucinations: string[] = []
  const oldTokens = tokenize(oldCode)
  const newTokens = tokenize(newCode)

  const declared = new Set<string>()
  for (const m of newCode.matchAll(/(function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(|const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=|let\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=|class\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*)/g)) {
    const name = m[2] || m[3] || m[4] || m[5]
    if (name) declared.add(name)
  }

  const used = new Set<string>()
  for (const tok of newTokens) {
    used.add(tok)
  }

  const allowedGlobals = new Set<string>([
    'console','require','module','exports','process','__dirname','__filename','fetch','window','document','setTimeout','setInterval','URL','Path','Math','Date','JSON'
  ])

  for (const u of used) {
    if (!declared.has(u) && !allowedGlobals.has(u)) {
      if (!oldTokens.includes(u)) {
        hallucinations.push(`Missing variable or function: ${u}`)
      }
    }
  }

  for (const m of newCode.matchAll(/import\s+[^'";]+from\s+['"]([^'";]+)['"]/g)) {
    const spec = m[1]
    if (spec.startsWith('http://') || spec.startsWith('https://')) {
      hallucinations.push(`Unsupported import source: ${spec}`)
    }
  }

  if (/Anthropic|OpenAI|Groq|Gemini/i.test(newCode) && !/import\s+/i.test(newCode)) {
    hallucinations.push('AI API usage without proper import')
  }

  return hallucinations.slice(0, 50)
}

function detectRisks(oldCode: string, newCode: string): string[] {
  const risks: string[] = []
  const oldTry = (oldCode.match(/\btry\b/g) || []).length
  const newTry = (newCode.match(/\btry\b/g) || []).length
  const oldCatch = (oldCode.match(/\bcatch\b/g) || []).length
  const newCatch = (newCode.match(/\bcatch\b/g) || []).length
  if (newTry < oldTry || newCatch < oldCatch) {
    risks.push('Removed error-handling blocks')
  }

  const importNames: string[] = []
  for (const m of newCode.matchAll(/import\s+\{?\s*([^}]+)\s*\}?\s*from\s*['"][^'"]+['"]/g)) {
    const names = m[1].split(',').map((s) => s.trim()).filter(Boolean)
    importNames.push(...names)
  }
  for (const n of importNames) {
    const re = new RegExp(`\\b${n}\\b`)
    if (!re.test(newCode.replace(new RegExp(`import[^\n]+${n}[^\n]+`, 'g'), ''))) {
      risks.push(`Unused import: ${n}`)
    }
  }

  const dangerPatterns = /(validate|sanitize|assert|auth|token|csrf|catch|try|error|warn)/i
  const removedDanger: string[] = []
  const oldLines = oldCode.split('\n')
  const newSet = new Set(newCode.split('\n'))
  for (const line of oldLines) {
    if (!newSet.has(line) && dangerPatterns.test(line)) {
      removedDanger.push(line.trim())
    }
  }
  if (removedDanger.length) {
    risks.push('Dangerous deletions detected')
  }

  return Array.from(new Set(risks)).slice(0, 50)
}

function computeReliabilityScore(input: {
  oldCode: string
  newCode: string
  added: number
  removed: number
  modified: number
  risks: string[]
  hallucinations: string[]
}): number {
  let score = 100
  const churn = input.added + input.removed
  score -= Math.min(30, Math.floor(churn / 20))
  score -= Math.min(40, input.risks.length * 6)
  score -= Math.min(30, input.hallucinations.length * 4)
  if (/\btry\b/.test(input.oldCode) && !/\btry\b/.test(input.newCode)) score -= 10
  if (score < 0) score = 0
  if (score > 100) score = 100
  return score
}

function buildSafePatch(oldCode: string, newCode: string): string {
  const danger = /(validate|sanitize|assert|auth|token|csrf|catch|try|error|warn)/i
  const oldLines = oldCode.split('\n')
  const newLines = newCode.split('\n')
  const newSet = new Set(newLines)
  const reinserts: string[] = []
  for (const line of oldLines) {
    if (!newSet.has(line) && danger.test(line)) {
      reinserts.push(line)
    }
  }
  const result = [...newLines]
  for (const r of reinserts) {
    result.push(r)
  }
  return result.join('\n')
}

export default router