export default function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`card ${className}`.trim()}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">
            {icon && (
              <span className="card-title-icon" aria-hidden="true">
                {icon}
              </span>
            )}
            {title}
          </h3>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}