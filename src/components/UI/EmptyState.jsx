export default function EmptyState({ message, icon }) {
  return (
    <div className="empty-state">
      {icon && <span aria-hidden="true">{icon}</span>}
      <p>{message}</p>
    </div>
  )
}