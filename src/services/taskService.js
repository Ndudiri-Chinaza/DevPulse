export function createTask(tasks, title) {
  const nextId =
    tasks.reduce((max, task) => Math.max(max, task.id ?? 0), 0) + 1

  return [
    ...tasks,
    {
      id: nextId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  )
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

export function getTaskCounts(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const remaining = total - completed
  return { total, completed, remaining }
}
