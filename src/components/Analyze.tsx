import React, { useState } from 'react'

interface AnalyzePayload {
  score: number
  hallucinations: string[]
  reasoning: string
  risks: string[]
  diff_summary: { added: number; removed: number; modified: number }
  low_confidence_lines: number[]
  safe_patch: string
  raw_diff: string
}

export default function Analyze() {
  const [oldCode, setOldCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [result, setResult] = useState<AnalyzePayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!oldCode.trim() || !newCode.trim()) {
      setError('Enter both OLD and NEW code')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldCode, newCode }),
      })
      if (!response.ok) throw new Error('Analysis failed')
      const data = await response.json()
      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const applySafePatch = () => {
    if (result?.safe_patch) {
      setNewCode(result.safe_patch)
    }
  }

  const copyPatch = async () => {
    if (result?.safe_patch) {
      await navigator.clipboard.writeText(result.safe_patch)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">OLD Code</h3>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            placeholder="Paste original code here"
            className="w-full h-64 px-3 py-2 bg-black/30 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
            aria-label="Old code editor"
          />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">NEW Code</h3>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Paste SOLO-generated code here"
            className="w-full h-64 px-3 py-2 bg-black/30 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-y"
            aria-label="New code editor"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          aria-pressed={loading}
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
        {result && (
          <>
            <button onClick={copyPatch} className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 border border-white/20">
              Copy patch
            </button>
            <button onClick={applySafePatch} className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 border border-white/20">
              Replace NEW code with patch
            </button>
          </>
        )}
        {error && <span className="text-red-300">{error}</span>}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold text-white">Reliability Score</h4>
                <p className="text-gray-300 text-sm">0–100 based on safety and correctness</p>
              </div>
              <div
                className={`text-3xl font-bold ${
                  result.score >= 80 ? 'text-green-400' : result.score >= 60 ? 'text-yellow-300' : 'text-red-400'
                }`}
                aria-label={`Reliability score ${result.score}`}
              >
                {result.score}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-blue-400">{result.diff_summary.added}</div>
                <div className="text-sm text-gray-300">Added</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-pink-400">{result.diff_summary.removed}</div>
                <div className="text-sm text-gray-300">Removed</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-purple-400">{result.diff_summary.modified}</div>
                <div className="text-sm text-gray-300">Modified</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-2">Hallucinations</h4>
              <ul className="space-y-2">
                {result.hallucinations.length === 0 && (
                  <li className="text-gray-300">None</li>
                )}
                {result.hallucinations.map((h, i) => (
                  <li key={i} className="text-pink-300">{h}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-2">Risk Flags</h4>
              <ul className="space-y-2">
                {result.risks.length === 0 && (
                  <li className="text-gray-300">None</li>
                )}
                {result.risks.map((r, i) => (
                  <li key={i} className="text-yellow-300">{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">AI Transparency</h4>
            <p className="text-gray-200 text-sm whitespace-pre-wrap">{result.reasoning}</p>
            {result.low_confidence_lines.length > 0 && (
              <div className="mt-3 text-xs text-gray-300">
                Low-confidence lines: {result.low_confidence_lines.slice(0, 20).join(', ')}
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">Diff</h4>
            <pre className="bg-black/40 text-gray-200 p-4 rounded-md overflow-auto max-h-96 text-xs" aria-label="Raw diff viewer">
              {result.raw_diff}
            </pre>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">Suggested Fixes (Safe Patch)</h4>
            <textarea
              value={result.safe_patch}
              readOnly
              className="w-full h-40 px-3 py-2 bg-black/30 border border-white/20 rounded-md text-white text-xs"
              aria-label="Safe patch"
            />
            <div className="mt-3 flex gap-3">
              <button onClick={copyPatch} className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 border border-white/20">
                Copy patch
              </button>
              <button onClick={applySafePatch} className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 border border-white/20">
                Replace NEW code with patch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}