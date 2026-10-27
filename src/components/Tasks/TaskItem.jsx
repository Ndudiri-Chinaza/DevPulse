import { FaTrashAlt } from 'react-icons/fa'

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <label className="task-toggle">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-title">{task.title}</span>
      </label>
      <button
        type="button"
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
        title="Delete task"
      >
        <FaTrashAlt aria-hidden="true" />
      </button>
    </li>
  )
}