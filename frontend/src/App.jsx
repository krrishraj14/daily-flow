import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import BriefingCard from './components/BriefingCard'
import AINews from './components/AINews'
import TaskManager from './components/TaskManager'
import StandupGenerator from './components/StandupGenerator'
import DailyInsights from './components/DailyInsights'

const API = 'http://localhost:8000'

export default function App() {
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

  const completedCount = tasks.filter(t => t.completed).length

  const handleRefresh = useCallback(() => {
    fetchBriefing()
    fetchNews()
  }, [fetchBriefing, fetchNews])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onRefresh={handleRefresh} />

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        <BriefingCard
          briefing={briefing}
          loading={briefingLoading}
          error={briefingError}
        />

        <AINews news={news} loading={newsLoading} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[60%]">
            {tasksLoading ? (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-gray-100 rounded-lg mb-4" />
                <div className="h-24 bg-gray-100 rounded-2xl mb-3" />
                <div className="h-24 bg-gray-100 rounded-2xl" />
              </div>
            ) : (
              <TaskManager tasks={tasks} onTasksChange={setTasks} />
            )}
          </div>

          <div className="w-full lg:w-[40%] flex flex-col gap-4 self-stretch">
            <StandupGenerator completedCount={completedCount} />
            <DailyInsights totalTasks={tasks.length} />
          </div>
        </div>
      </main>
    </div>
  )
}
