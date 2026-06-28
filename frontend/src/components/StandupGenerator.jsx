import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ completedCount: number }} props
 */
export default function StandupGenerator({ completedCount }) {
  const [standup, setStandup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  if (completedCount === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-3 flex-1">
        <h2 className="text-base font-semibold text-gray-800">Standup Generator</h2>
        <p className="text-sm text-gray-400">Complete a task to unlock your standup summary.</p>
        <div className="mt-auto h-1.5 bg-gray-100 rounded-full" />
      </div>
    )
  }

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/standup`)
      if (!res.ok) throw new Error('Failed to generate standup')
      const data = await res.json()
      setStandup(data.standup)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!standup) return
    await navigator.clipboard.writeText(standup)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Standup Generator</h2>
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
          {completedCount} done
        </span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating…
          </>
        ) : (
          'Generate Standup'
        )}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {standup && (
        <div className="flex flex-col gap-2">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-100 font-mono leading-relaxed whitespace-pre-wrap">
            {standup}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
