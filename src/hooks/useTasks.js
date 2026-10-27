import usePersistedState from './usePersistedState.js'
import { taskStorageAdapter } from '../utils/storage.js'
import {
  createTask,
  toggleTask as toggleTaskLogic,
  removeTask as removeTaskLogic,
  getTaskCounts,
} from '../services/taskService.js'

export default function useTasks(storage = taskStorageAdapter) {
  const [tasks, setTasks] = usePersistedState(storage)

  function addTask(title) {
    setTasks((prev) => createTask(prev, title))
  }

  function toggleTask(id) {
    setTasks((prev) => toggleTaskLogic(prev, id))
  }

  function deleteTask(id) {
    setTasks((prev) => removeTaskLogic(prev, id))
  }

  const { total, completed, remaining } = getTaskCounts(tasks)

  return { tasks, addTask, toggleTask, deleteTask, total, completed, remaining }
}