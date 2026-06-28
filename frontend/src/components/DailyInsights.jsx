import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ totalTasks: number }} props
 */
export default function DailyInsights({ totalTasks }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (totalTasks < 3) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex-1">
        <h2 className="text-base font-semibold text-gray-800 mb-2">Daily Insights</h2>
        <p className="text-sm text-gray-400">
          Add {3 - totalTasks} more task{3 - totalTasks !== 1 ? 's' : ''} to unlock insights.
        </p>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-300 rounded-full transition-all duration-500"
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
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-4 flex-1">
      <h2 className="text-base font-semibold text-gray-800">Daily Insights</h2>

      <button
        onClick={handleGet}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors duration-200"
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

      {error && <p className="text-xs text-red-500">{error}</p>}

      {insights && (
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-900 leading-relaxed whitespace-pre-wrap">
          {insights}
        </div>
      )}
    </div>
  )
}
