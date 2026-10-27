import { useState } from 'react'
import { FaListUl, FaTasks } from 'react-icons/fa'
import useTasks from '../../hooks/useTasks.js'
import EmptyState from '../UI/EmptyState.jsx'
import TaskForm from './TaskForm.jsx'
import TaskList from './TaskList.jsx'
import './Tasks.css'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export default function TaskSection() {
  const { tasks, addTask, toggleTask, deleteTask, total, completed, remaining } =
    useTasks()
  const [filter, setFilter] = useState('all')

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2 className="section-heading">
          <FaTasks aria-hidden="true" />
          Tasks
        </h2>
      </div>

      <div className="card tasks-card">
        <div className="card-body">
          <TaskForm onAdd={addTask} />

          <div className="task-summary" aria-live="polite">
            <span>{remaining} remaining</span>
            <span>{completed} completed</span>
            <span>{total} total</span>
          </div>

          <div className="task-filters" role="group" aria-label="Filter tasks">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-button${filter === item.id ? ' active' : ''}`}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {total === 0 ? (
            <EmptyState message="No tasks yet. Add one above." icon={<FaListUl />} />
          ) : visibleTasks.length === 0 ? (
            <EmptyState message="No tasks match this filter." icon={<FaListUl />} />
          ) : (
            <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
          )}
        </div>
      </div>
    </div>
  )
}