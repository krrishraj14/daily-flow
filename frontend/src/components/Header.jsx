/**
 * @param {{ onRefresh: () => void }} props
 */
export default function Header({ onRefresh }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
          DailyPulse
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{dateStr}</p>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </header>
  )
}
