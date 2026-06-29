import { useState } from 'react'
import WelcomeButton from './WelcomeButton'

/**
 * @param {{ onRefresh: () => void, darkMode: boolean, onDarkModeChange: (dark: boolean) => void, onSearch: (query: string) => void }} props
 */
export default function Header({ onRefresh, darkMode, onDarkModeChange, onSearch }) {
  const [searchInput, setSearchInput] = useState('')
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

      <div className="relative flex items-center hidden sm:flex ml-auto mr-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            onSearch(e.target.value)
          }}
          className={`w-10 h-10 rounded-full border-2 outline-none pl-10 pr-3 py-2 transition-all duration-500 ease-in-out font-medium text-sm ${
            searchInput
              ? darkMode
                ? 'w-64 bg-slate-700 border-blue-600 text-gray-100 placeholder-gray-400'
                : 'w-64 bg-blue-50 border-blue-500 text-gray-800 placeholder-gray-500'
              : darkMode
              ? 'bg-slate-800 border-slate-700 text-gray-400 placeholder-gray-500'
              : 'bg-white border-gray-200 text-gray-400 placeholder-gray-500'
          }`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`absolute left-3 w-5 h-5 transition-all duration-300 pointer-events-none ${
            darkMode ? 'text-blue-500' : 'text-blue-600'
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
