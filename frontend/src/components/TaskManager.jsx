import { useState } from 'react'
import TaskCard from './TaskCard'

const API = 'http://localhost:8000'

/**
 * @param {{ tasks: object[], onTasksChange: (tasks: object[]) => void }} props
 */
export default function TaskManager({ tasks, onTasksChange }) {
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)

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
      onTasksChange([...tasks, task])
      setInput('')
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
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-800">Smart Task Manager</h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task…"
          disabled={adding}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shrink-0"
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
        <p className="text-xs text-red-500 -mt-2">{error}</p>
      )}

      {adding && (
        <div className="rounded-2xl p-4 border border-indigo-100 bg-indigo-50 animate-pulse">
          <div className="h-4 bg-indigo-200 rounded w-1/2 mb-3" />
          <div className="h-3 bg-indigo-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-indigo-100 rounded w-2/3" />
        </div>
      )}

      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          In Progress ({inProgress.length})
        </p>
        {inProgress.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No tasks yet — add one above!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {inProgress.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
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
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
