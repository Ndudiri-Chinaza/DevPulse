export function isValidTask(task) {
  if (task === null || typeof task !== 'object' || Array.isArray(task)) {
    return false
  }
  if (!Number.isInteger(task.id)) return false
  if (typeof task.title !== 'string') return false
  if (typeof task.completed !== 'boolean') return false
  if (task.createdAt != null && typeof task.createdAt !== 'string') return false
  return true
}

function sanitizeTasks(value) {
  // Not an array at all: the whole payload is unusable, so purge the key
  // rather than leaving a bad value in storage for the next load to re-read.
  if (!Array.isArray(value)) return { tasks: [], purge: true }

  const seen = new Set()
  const tasks = []

  for (const task of value) {
    if (!isValidTask(task)) continue
    // Duplicate ids would break React keys and toggle/delete targeting.
    if (seen.has(task.id)) continue
    seen.add(task.id)
    tasks.push(task)
  }

  return { tasks, purge: false, recovered: tasks.length !== value.length }
}

export function createStorageAdapter(key, fallback = [], sanitize) {
  // Defined as standalone closures rather than object methods so that a
  // destructured `const { load } = adapter` still works.
  function save(data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // Storage unavailable (private browsing, quota) - keep data in memory only.
    }
  }

  function clear() {
    try {
      localStorage.removeItem(key)
    } catch {
      // Storage unavailable - nothing to clear.
    }
  }

  function load() {
    let stored = null

    try {
      stored = localStorage.getItem(key)
    } catch {
      return fallback
    }

    if (!stored) return fallback

    let parsed
    try {
      parsed = JSON.parse(stored)
    } catch {
      // Unparseable payload. Drop it so the app recovers on next load.
      clear()
      return fallback
    }

    if (!sanitize) return parsed

    const { tasks, purge, recovered } = sanitize(parsed)

    // Persist the repair so it does not repeat on every load.
    if (purge) {
      clear()
    } else if (recovered) {
      save(tasks)
    }

    return tasks
  }

  return { load, save, clear }
}

export const taskStorageAdapter = createStorageAdapter('tasks', [], sanitizeTasks)

// Backward compatibility helpers
export function getTasks() {
  return taskStorageAdapter.load()
}

export function saveTasks(tasks) {
  taskStorageAdapter.save(tasks)
}