import { Link } from 'react-router-dom'
import { FaCheckCircle, FaGithub, FaListUl, FaClock, FaTasks } from 'react-icons/fa'
import WeatherWidget from '../components/Weather/WeatherWidget.jsx'
import useTaskCounts from '../hooks/useTaskCounts.js'
import './Pages.css'

const stats = [
  { key: 'total', label: 'Total tasks', icon: <FaListUl /> },
  { key: 'completed', label: 'Completed', icon: <FaCheckCircle /> },
  { key: 'remaining', label: 'Remaining', icon: <FaClock /> },
]

export default function DashboardPage() {
  const counts = useTaskCounts()

  return (
    <div className="overview-page">
      <div className="dashboard-welcome">
        <h2>Welcome back</h2>
        <p>
          Track your GitHub activity, manage your tasks, and check the weather
          for your city — all in one place.
        </p>
      </div>

      <div className="dashboard-grid">
        <section className="summary-stats" aria-labelledby="summary-heading">
          <div className="section-header">
            <h2 id="summary-heading" className="section-heading">
              <FaTasks aria-hidden="true" />
              Summary
            </h2>
          </div>

          <div className="stat-cards">
            {stats.map((stat) => (
              <div key={stat.key} className="stat-card">
                <span className="stat-card-icon" aria-hidden="true">
                  {stat.icon}
                </span>
                <div className="stat-card-value">{counts[stat.key]}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="summary-links">
            <Link to="/github" className="summary-link">
              <FaGithub aria-hidden="true" />
              Check GitHub
            </Link>
            <Link to="/tasks" className="summary-link">
              <FaTasks aria-hidden="true" />
              Go to tasks
            </Link>
          </div>
        </section>

        <WeatherWidget />
      </div>
    </div>
  )
}