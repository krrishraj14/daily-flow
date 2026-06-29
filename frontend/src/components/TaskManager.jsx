import { useState } from 'react'
import TaskCard from './TaskCard'
import CloudAnimation from './CloudAnimation'

const API = 'http://localhost:8000'

/**
 * @param {{ tasks: object[], onTasksChange: (tasks: object[]) => void, darkMode: boolean, searchQuery: string }} props
 */
export default function TaskManager({ tasks, onTasksChange, darkMode, searchQuery = '' }) {
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [newTaskId, setNewTaskId] = useState(null)

  const inProgress = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  async function handleAdd(e) {
    e.preventDefault()
    if (!input.trim()) return
    setAdding(true)
    setError(null)
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() }),
      })
      if (!res.ok) throw new Error('Failed to add task')
      const task = await res.json()
      setNewTaskId(task.id)
      onTasksChange([...tasks, task])
      setInput('')
      setTimeout(() => setNewTaskId(null), 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleComplete(id) {
    try {
      const res = await fetch(`${API}/tasks/${id}/complete`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to complete task')
      const updated = await res.json()
      onTasksChange(tasks.map(t => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUncomplete(id) {
    try {
      const res = await fetch(`${API}/tasks/${id}/uncomplete`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to undo task')
      const updated = await res.json()
      onTasksChange(tasks.map(t => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      onTasksChange(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={`rounded-2xl shadow-md border p-5 flex flex-col gap-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Smart Task Manager</h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task…"
          disabled={adding}
          className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-50 ${
            darkMode
              ? 'border-slate-600 bg-slate-700 text-gray-100 placeholder-gray-400 focus:ring-indigo-500'
              : 'border-gray-200 bg-white text-gray-800 placeholder-gray-500 focus:ring-indigo-300'
          }`}
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shrink-0 ${
            darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {adding ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Adding…
            </span>
          ) : (
            'Add Task'
          )}
        </button>
      </form>

      {error && (
        <p className={`text-xs -mt-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
      )}

      {adding && (
        <div className={`rounded-2xl p-4 border animate-pulse ${darkMode ? 'border-indigo-900 bg-indigo-950' : 'border-indigo-100 bg-indigo-50'}`}>
          <div className={`h-4 rounded w-1/2 mb-3 ${darkMode ? 'bg-indigo-800' : 'bg-indigo-200'}`} />
          <div className={`h-3 rounded w-3/4 mb-2 ${darkMode ? 'bg-indigo-800' : 'bg-indigo-100'}`} />
          <div className={`h-3 rounded w-2/3 ${darkMode ? 'bg-indigo-800' : 'bg-indigo-100'}`} />
        </div>
      )}

      <section>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          In Progress ({inProgress.length})
        </p>
        {inProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CloudAnimation darkMode={darkMode} />
            <p className={`text-sm font-medium mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tasks yet</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add one above to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inProgress.map(task => (
              <div
                key={task.id}
                className={`transition-all duration-300 ${
                  newTaskId === task.id
                    ? 'animate-in fade-in slide-in-from-bottom-2'
                    : ''
                }`}
                style={
                  newTaskId === task.id
                    ? {
                        animation: 'fadeInUp 0.4s ease-out',
                      }
                    : {}
                }
              >
                <TaskCard
                  task={task}
                  onComplete={handleComplete}
                  onUncomplete={handleUncomplete}
                  onDelete={handleDelete}
                  onTaskUpdate={(updated) => onTasksChange(tasks.map(t => (t.id === updated.id ? updated : t)))}
                  darkMode={darkMode}
                  searchQuery={searchQuery}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="flex items-center gap-2 w-full text-left mb-2 group"
          >
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Completed Today ({completed.length})
            </p>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showCompleted ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCompleted && (
            <div className="flex flex-col gap-3">
              {completed.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onUncomplete={handleUncomplete}
                  onDelete={handleDelete}
                  onTaskUpdate={(updated) => onTasksChange(tasks.map(t => (t.id === updated.id ? updated : t)))}
                  darkMode={darkMode}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
