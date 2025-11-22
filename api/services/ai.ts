interface AIInput {
  oldCode: string
  newCode: string
  risks: string[]
  hallucinations: string[]
  raw_diff: string
}

interface AIOutput {
  score?: number
  hallucinations?: string[]
  reasoning?: string
  risks?: string[]
  diff_summary?: { added: number; removed: number; modified: number }
  low_confidence_lines?: number[]
  safe_patch?: string
}

export async function aiAnalyze(input: AIInput): Promise<AIOutput> {
  const provider = process.env.SOLOGUARD_AI_PROVIDER || 'mock'
  if (provider === 'mock') {
    const reasoning = buildReasoning(input)
    return {
      reasoning,
      risks: input.risks,
      hallucinations: input.hallucinations,
    }
  }
  return {
    reasoning: 'AI provider not configured; using heuristic results',
    risks: input.risks,
    hallucinations: input.hallucinations,
  }
}

function buildReasoning(input: AIInput): string {
  const linesOld = input.oldCode.split('\n').length
  const linesNew = input.newCode.split('\n').length
  const delta = linesNew - linesOld
  const riskText = input.risks.join('; ')
  const hallText = input.hallucinations.join('; ')
  return `Compared ${linesOld}→${linesNew} lines (Δ ${delta}). Risks: ${riskText || 'none'}. Hallucinations: ${hallText || 'none'}.`
}