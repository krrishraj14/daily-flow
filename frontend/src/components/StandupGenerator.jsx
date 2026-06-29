import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ completedCount: number, darkMode: boolean }} props
 */
export default function StandupGenerator({ completedCount, darkMode }) {
  const [standup, setStandup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  if (completedCount === 0) {
    return (
      <div className={`rounded-2xl shadow-md border p-5 flex flex-col gap-3 flex-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Standup Generator</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Complete a task to unlock your standup summary.</p>
        <div className={`mt-auto h-1.5 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
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
    <div className={`rounded-2xl shadow-md border p-5 flex flex-col gap-4 flex-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Standup Generator</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'text-green-400 bg-green-950' : 'text-green-600 bg-green-50'}`}>
          {completedCount} done
        </span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`flex items-center justify-center gap-2 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors duration-200 ${
          darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
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

      {error && <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}

      {standup && (
        <div className="flex flex-col gap-2">
          <div className={`border rounded-xl p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap ${
            darkMode
              ? 'bg-slate-950 border-slate-600 text-gray-200'
              : 'bg-gray-900 border-gray-700 text-gray-100'
          }`}>
            {standup}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border rounded-lg transition-all duration-300 ${
              copied
                ? darkMode ? 'text-green-400 bg-green-950 border-green-800' : 'text-green-600 bg-green-50 border-green-200'
                : darkMode ? 'text-gray-400 border-slate-600 hover:bg-slate-700' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
