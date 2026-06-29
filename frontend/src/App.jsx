import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import BriefingCard from './components/BriefingCard'
import AINews from './components/AINews'
import TaskManager from './components/TaskManager'
import StandupGenerator from './components/StandupGenerator'
import DailyInsights from './components/DailyInsights'

const API = 'http://localhost:8000'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [briefingError, setBriefingError] = useState(null)

  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)

  const fetchBriefing = useCallback(async () => {
    setBriefingLoading(true)
    setBriefingError(null)
    try {
      const res = await fetch(`${API}/briefing`)
      if (!res.ok) throw new Error('Failed to fetch briefing')
      const data = await res.json()
      setBriefing(data)
    } catch (err) {
      setBriefingError(err.message)
    } finally {
      setBriefingLoading(false)
    }
  }, [])

  const fetchNews = useCallback(async () => {
    setNewsLoading(true)
    try {
      const res = await fetch(`${API}/ai-news`)
      if (!res.ok) throw new Error('Failed to fetch news')
      const data = await res.json()
      setNews(data.news || [])
    } catch {
      setNews([])
    } finally {
      setNewsLoading(false)
    }
  }, [])

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true)
    try {
      const res = await fetch(`${API}/tasks`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data)
    } catch {
      // non-fatal — show empty list
    } finally {
      setTasksLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBriefing()
    fetchNews()
    fetchTasks()
  }, [fetchBriefing, fetchNews, fetchTasks])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    console.log('Dark mode toggled:', darkMode)
  }, [darkMode])

  const completedCount = tasks.filter(t => t.completed).length

  const handleRefresh = useCallback(() => {
    fetchBriefing()
    fetchNews()
  }, [fetchBriefing, fetchNews])

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950"
      style={darkMode ? { backgroundColor: '#020617' } : { backgroundColor: '#F8FAFC' }}
    >
      <Header onRefresh={handleRefresh} darkMode={darkMode} onDarkModeChange={setDarkMode} />

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        <BriefingCard
          briefing={briefing}
          loading={briefingLoading}
          error={briefingError}
          darkMode={darkMode}
        />

        <AINews news={news} loading={newsLoading} darkMode={darkMode} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[60%]">
            {tasksLoading ? (
              <div className={`rounded-2xl shadow-md border p-5 animate-pulse ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className={`h-4 rounded w-1/3 mb-4 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
                <div className={`h-10 rounded-lg mb-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
                <div className={`h-24 rounded-2xl mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
                <div className={`h-24 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`} />
              </div>
            ) : (
              <TaskManager tasks={tasks} onTasksChange={setTasks} darkMode={darkMode} />
            )}
          </div>

          <div className="w-full lg:w-[40%] flex flex-col gap-4 self-stretch">
            <StandupGenerator completedCount={completedCount} darkMode={darkMode} />
            <DailyInsights totalTasks={tasks.length} darkMode={darkMode} />
          </div>
        </div>
      </main>
    </div>
  )
}
