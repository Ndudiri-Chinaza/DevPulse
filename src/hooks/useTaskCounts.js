import useTasks from './useTasks.js'
import { taskStorageAdapter } from '../utils/storage.js'

export default function useTaskCounts(storage = taskStorageAdapter) {
  const { total, completed, remaining } = useTasks(storage)
  return { total, completed, remaining }
}
