import WelcomeButton from './WelcomeButton'

/**
 * @param {{ onRefresh: () => void, darkMode: boolean, onDarkModeChange: (dark: boolean) => void }} props
 */
export default function Header({ onRefresh, darkMode, onDarkModeChange }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className={`flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b shadow-sm gap-3 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
          DailyPulse
        </h1>
        <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{dateStr}</p>
      </div>

      <WelcomeButton />

      <div className="relative flex items-center hidden sm:flex">
        <input
          type="text"
          placeholder="Search something..."
          className={`w-10 h-10 rounded-full border-none outline-none px-4 py-2 transition-all duration-500 ease-in-out ${
            darkMode
              ? 'bg-slate-800 text-gray-100 placeholder-transparent focus:placeholder-gray-600 focus:w-72 focus:bg-slate-700 focus:border-indigo-600 focus:border'
              : 'bg-transparent text-gray-800 placeholder-transparent focus:placeholder-gray-400 focus:w-72 focus:bg-white focus:border-indigo-500 focus:border'
          }`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`absolute left-3 w-5 h-5 transition-all duration-500 pointer-events-none ${
            darkMode ? 'fill-indigo-500' : 'fill-indigo-600'
          }`}
        >
          <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
          <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
          <g id="SVGRepo_iconCarrier">
            <rect fill="white" height="24" width="24"></rect>
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
              clipRule="evenodd"
              fillRule="evenodd"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            console.log('Dark mode button clicked, current:', darkMode, 'toggling to:', !darkMode)
            onDarkModeChange(!darkMode)
          }}
          className={`flex items-center justify-center w-9 h-9 px-2 py-2 border rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'text-gray-300 border-slate-700 hover:bg-slate-800'
              : 'text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.657 1.343l-.707-.707M6.343 18.657l-.707-.707m12.014-12.014l-.707.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        <button
          onClick={onRefresh}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border rounded-lg transition-colors duration-200 whitespace-nowrap ${
            darkMode
              ? 'text-indigo-400 border-indigo-900 hover:bg-slate-800'
              : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  )
}
