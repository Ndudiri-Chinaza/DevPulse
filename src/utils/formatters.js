export function capitalize(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatNumber(value) {
  if (value >= 1000) return `${Math.round((value / 1000) * 10) / 10}k`
  return value
}

export function formatDay(dateStr, index) {
  if (index === 0) return 'Today'
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
  })
}

export function formatWhen(event) {
  const date = new Date(event?.created_at ?? event)
  if (Number.isNaN(date.getTime())) return 'Recently'

  return (
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  )
}

export function formatLocation(coords) {
  if (!coords) return ''
  return [coords.name, coords.admin1, coords.country].filter(Boolean).join(', ')
}
