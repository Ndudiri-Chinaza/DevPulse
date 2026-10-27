import './Header.css'

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="header-text">
        <h1 className="header-title">Developer Dashboard</h1>
        <p className="header-date">{today}</p>
      </div>
    </header>
  )
}