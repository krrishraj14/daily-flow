import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ totalTasks: number, darkMode: boolean }} props
 */
export default function DailyInsights({ totalTasks, darkMode }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (totalTasks < 3) {
    return (
      <div className={`rounded-2xl shadow-md border p-5 flex-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-base font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Daily Insights</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Add {3 - totalTasks} more task{3 - totalTasks !== 1 ? 's' : ''} to unlock insights.
        </p>
        <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-indigo-600' : 'bg-indigo-300'}`}
            style={{ width: `${(totalTasks / 3) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  async function handleGet() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/insights`)
      if (!res.ok) throw new Error('Failed to fetch insights')
      const data = await res.json()
      setInsights(data.insights)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-2xl shadow-md border p-5 flex flex-col gap-4 flex-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Daily Insights</h2>

      <button
        onClick={handleGet}
        disabled={loading}
        className={`flex items-center justify-center gap-2 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors duration-200 ${
          darkMode ? 'bg-violet-700 hover:bg-violet-600' : 'bg-violet-600 hover:bg-violet-700'
        }`}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing…
          </>
        ) : (
          'Get Insights'
        )}
      </button>

      {error && <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}

      {insights && (
        <div className={`border rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
          darkMode
            ? 'bg-violet-950 border-violet-800 text-violet-100'
            : 'bg-violet-50 border-violet-100 text-violet-900'
        }`}>
          {insights}
        </div>
      )}
    </div>
  )
}
