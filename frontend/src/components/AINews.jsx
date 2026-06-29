/**
 * @param {{ news: object[], loading: boolean, darkMode: boolean }} props
 */
export default function AINews({ news, loading, darkMode }) {
  if (loading) {
    return (
      <div className={`w-full rounded-2xl p-6 shadow-md border animate-pulse ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className={`h-4 rounded w-1/3 mb-4 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
        <div className={`h-20 rounded-lg mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
        <div className={`h-20 rounded-lg mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
        <div className={`h-20 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
      </div>
    )
  }

  return (
    <div className={`w-full rounded-2xl p-6 shadow-md border flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
          🤖 AI News
        </span>
        <span className={`h-px flex-1 bg-gradient-to-r ${darkMode ? 'from-cyan-700' : 'from-cyan-200'} to-transparent`} />
      </div>

      {news && news.length > 0 ? (
        <div className={`flex-1 overflow-y-auto max-h-96 space-y-2 pr-3 scrollbar-thin scrollbar-track-transparent ${darkMode ? 'scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500' : 'scrollbar-thumb-cyan-200 hover:scrollbar-thumb-cyan-300'}`}>
          {news.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-all duration-200 group border hover:shadow-md ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-700 to-slate-600 border-slate-600 hover:from-slate-600 hover:to-slate-500 hover:border-slate-500'
                  : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-300'
              }`}
            >
              <h3 className={`text-sm font-semibold mb-1.5 line-clamp-2 group-hover:line-clamp-none transition-all ${
                darkMode
                  ? 'text-gray-100 group-hover:text-cyan-300'
                  : 'text-gray-800 group-hover:text-cyan-700'
              }`}>
                {item.title}
              </h3>
              <p className={`text-xs line-clamp-2 ${
                darkMode
                  ? 'text-gray-400 group-hover:text-gray-300'
                  : 'text-gray-600 group-hover:text-gray-700'
              }`}>{item.content}</p>
              <span className={`inline-block mt-2 text-xs font-medium ${
                darkMode
                  ? 'text-cyan-400 group-hover:text-cyan-300'
                  : 'text-cyan-600 group-hover:text-cyan-700'
              }`}>Read more →</span>
            </a>
          ))}
        </div>
      ) : (
        <p className={`text-sm py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No AI news available</p>
      )}
    </div>
  )
}
