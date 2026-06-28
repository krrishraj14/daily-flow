/**
 * @param {{ news: object[], loading: boolean }} props
 */
export default function AINews({ news, loading }) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl p-6 bg-white shadow-md border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-100 rounded-lg mb-3" />
        <div className="h-20 bg-gray-100 rounded-lg mb-3" />
        <div className="h-20 bg-gray-100 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl p-6 bg-white shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
          🤖 AI News
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-cyan-200 to-transparent" />
      </div>

      {news && news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg hover:bg-cyan-50 transition-colors group"
            >
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-cyan-700 mb-1 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">{item.content}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No AI news available</p>
      )}
    </div>
  )
}
