/**
 * @param {{ briefing: object|null, loading: boolean, error: string|null, darkMode: boolean }} props
 */
export default function BriefingCard({ briefing, loading, error, darkMode }) {
  if (loading) {
    return (
      <div className={`w-full rounded-2xl p-6 shadow-md border animate-pulse ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className={`h-4 rounded w-1/4 mb-4 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
        <div className={`h-6 rounded w-3/4 mb-3 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded w-2/3 mb-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
        <div className={`h-4 rounded w-1/2 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full rounded-2xl p-6 border text-sm ${darkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
        Failed to load briefing: {error}
      </div>
    )
  }

  if (!briefing) return null

  return (
    <div className={`w-full rounded-2xl p-6 shadow-md relative overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 pointer-events-none">
        <div className={`w-full h-full rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
            Morning Briefing
          </span>
          <span className={`h-px flex-1 bg-gradient-to-r ${darkMode ? 'from-indigo-700' : 'from-indigo-200'} to-transparent`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-indigo-950' : 'bg-indigo-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-400'}`}>Quote</p>
            <p className={`text-sm font-medium leading-relaxed ${darkMode ? 'text-indigo-100' : 'text-indigo-900'}`}>"{briefing.quote}"</p>
          </div>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-violet-950' : 'bg-violet-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? 'text-violet-300' : 'text-violet-400'}`}>Focus Tip</p>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-violet-100' : 'text-violet-900'}`}>{briefing.tip}</p>
          </div>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-purple-950' : 'bg-purple-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-400'}`}>Message</p>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-purple-100' : 'text-purple-900'}`}>{briefing.message}</p>
          </div>
        </div>

        {briefing.web_tip && (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Web Insight</p>
            <p className={`text-sm leading-relaxed line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{briefing.web_tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
