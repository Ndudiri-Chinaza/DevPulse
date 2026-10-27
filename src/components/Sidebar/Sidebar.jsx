import { NavLink } from 'react-router-dom'
import { FaChartLine, FaCheckSquare, FaGithub } from 'react-icons/fa'
import './Sidebar.css'

const sections = [
  { path: '/', label: 'Dashboard', icon: <FaChartLine />, end: true },
  { path: '/github', label: 'GitHub', icon: <FaGithub /> },
  { path: '/tasks', label: 'Tasks', icon: <FaCheckSquare /> },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="sidebar-brand" to="/">
        <span className="sidebar-brand-dot" aria-hidden="true" />
        <span className="sidebar-brand-name">DevPulse</span>
      </NavLink>
      <nav className="sidebar-nav" aria-label="Dashboard sections">
        {sections.map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            end={section.end}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span aria-hidden="true">{section.icon}</span>
            <span>{section.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}