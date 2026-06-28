/**
 * @param {{ task: object, onComplete: (id: string) => void, onDelete: (id: string) => void }} props
 */
export default function TaskCard({ task, onComplete, onDelete }) {
  const isCompleted = task.completed

  return (
    <div
      className={`rounded-2xl p-4 border border-l-4 shadow-sm transition-all duration-300 ${
        isCompleted
          ? 'bg-green-50 border-green-200 border-l-green-400'
          : 'bg-white border-gray-100 border-l-indigo-400'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isCompleted && (
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <h3
            className={`font-semibold text-sm ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 transition-colors duration-150 shrink-0"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {task.subtasks.map((subtask, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span
                className={`mt-0.5 w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-400 border-green-400'
                    : 'border-gray-300'
                }`}
              >
                {isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={isCompleted ? 'line-through text-gray-400' : ''}>{subtask}</span>
            </li>
          ))}
        </ul>
      )}

      {!isCompleted && (
        <button
          onClick={() => onComplete(task.id)}
          className="w-full py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
        >
          Mark Complete
        </button>
      )}

      {isCompleted && task.completed_at && (
        <p className="text-xs text-green-500 mt-1">
          Completed at {new Date(task.completed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
