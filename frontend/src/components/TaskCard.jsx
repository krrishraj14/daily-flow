import { useState, useCallback } from 'react'
import Confetti from './Confetti'

const API = 'http://localhost:8000'

/**
 * @param {{ task: object, onComplete: (id: string) => void, onUncomplete: (id: string) => void, onDelete: (id: string) => void, onTaskUpdate: (updatedTask: object) => void, darkMode: boolean }} props
 */
export default function TaskCard({ task, onComplete, onUncomplete, onDelete, onTaskUpdate, darkMode }) {
  const isCompleted = task.completed
  const [showConfetti, setShowConfetti] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleSubtaskToggle = useCallback(async (index) => {
    try {
      const res = await fetch(`${API}/tasks/${task.id}/subtasks/${index}`, { method: 'PUT' })
      if (!res.ok) throw new Error('Failed to update subtask')
      const updated = await res.json()
      if (onTaskUpdate) {
        onTaskUpdate(updated)
      }
    } catch (err) {
      console.error('Subtask update error:', err.message)
    }
  }, [task.id, onTaskUpdate])

  const handleComplete = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    onComplete(task.id)
  }

  const handleUncomplete = () => {
    onUncomplete(task.id)
  }

  return (
    <div
      className={`rounded-2xl p-4 border border-l-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-default ${
        isCompleted
          ? darkMode ? 'bg-green-950 border-green-800 border-l-green-600' : 'bg-green-50 border-green-200 border-l-green-400'
          : darkMode ? 'bg-slate-800 border-slate-700 border-l-indigo-600' : 'bg-white border-gray-100 border-l-indigo-400'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <div className="relative">
              <button
                onClick={handleUncomplete}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`w-5 h-5 shrink-0 hover:scale-110 transition-all duration-150 cursor-pointer relative ${
                  darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-600'
                }`}
                title="Click to undo"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {showTooltip && (
                <div className={`absolute left-0 bottom-full mb-2 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 ${darkMode ? 'bg-slate-900' : 'bg-gray-800'}`}>
                  Click to undo
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${darkMode ? 'border-t-slate-900' : 'border-t-gray-800'}`} />
                </div>
              )}
            </div>
          )}
          <h3
            className={`font-semibold text-sm ${
              isCompleted ? (darkMode ? 'line-through text-gray-600' : 'line-through text-gray-400') : (darkMode ? 'text-gray-100' : 'text-gray-800')
            }`}
          >
            {task.title}
          </h3>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className={`transition-colors duration-150 shrink-0 ${
            darkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-300 hover:text-red-400'
          }`}
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="space-y-2 mb-3">
          {task.subtasks.map((subtask, i) => {
            const subtaskObj = typeof subtask === 'string' ? { text: subtask, completed: false } : subtask
            const isSubtaskCompleted = subtaskObj.completed || false

            return (
              <li
                key={i}
                onClick={() => handleSubtaskToggle(i)}
                className={`flex items-start gap-2 text-xs cursor-pointer group p-2 rounded transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:bg-slate-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <button
                  className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                    isSubtaskCompleted
                      ? darkMode ? 'bg-indigo-600 border-indigo-600' : 'bg-indigo-500 border-indigo-500'
                      : darkMode ? 'border-slate-600 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubtaskToggle(i)
                  }}
                >
                  {isSubtaskCompleted && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 ${isSubtaskCompleted ? (darkMode ? 'line-through text-gray-600' : 'line-through text-gray-400') : ''}`}>
                  {subtaskObj.text}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {!isCompleted && (
        <>
          {showConfetti && <Confetti />}
          <button
            onClick={handleComplete}
            className={`w-full py-1.5 text-xs font-medium border rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'text-indigo-400 border-indigo-800 hover:bg-indigo-950'
                : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            Mark Complete
          </button>
        </>
      )}

      {isCompleted && task.completed_at && (
        <p className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Completed at {new Date(task.completed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
