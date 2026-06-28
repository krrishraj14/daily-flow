/**
 * @param {{ briefing: object|null, loading: boolean, error: string|null }} props
 */
export default function BriefingCard({ briefing, loading, error }) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl p-6 bg-white shadow-md border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full rounded-2xl p-6 bg-red-50 border border-red-200 text-red-600 text-sm">
        Failed to load briefing: {error}
      </div>
    )
  }

  if (!briefing) return null

  return (
    <div className="w-full rounded-2xl p-6 bg-white shadow-md relative overflow-hidden">
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 pointer-events-none">
        <div className="w-full h-full rounded-2xl bg-white" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Morning Briefing
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Quote</p>
            <p className="text-sm text-indigo-900 font-medium leading-relaxed">"{briefing.quote}"</p>
          </div>

          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-1">Focus Tip</p>
            <p className="text-sm text-violet-900 leading-relaxed">{briefing.tip}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-purple-900 leading-relaxed">{briefing.message}</p>
          </div>
        </div>

        {briefing.web_tip && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Web Insight</p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{briefing.web_tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
