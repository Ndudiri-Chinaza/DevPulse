import { FaGithub } from 'react-icons/fa'
import Card from '../UI/Card.jsx'
import EmptyState from '../UI/EmptyState.jsx'
import ErrorMessage from '../UI/ErrorMessage.jsx'
import Loading from '../UI/Loading.jsx'
import { describeEvent, getEventIcon } from '../../utils/githubEvents.js'
import { formatWhen } from '../../utils/formatters.js'

export default function GithubActivity({ events, loading, error }) {
  const hasEvents = events.length > 0
  const isRefreshing = loading && hasEvents
  const hasRefreshError = Boolean(error) && hasEvents
  const visibleEvents = events.slice(0, 8)

  return (
    <Card
      className="github-activity-card"
      title="Recent Activity"
      icon={<FaGithub />}
    >
      {isRefreshing && (
        <p className="refresh-status" role="status">Updating activity...</p>
      )}
      {hasRefreshError && (
        <ErrorMessage message="Could not refresh activity. Showing previously loaded data." />
      )}
      {loading && !hasEvents ? (
        <Loading message="Loading activity..." />
      ) : error && !hasRefreshError ? (
        <ErrorMessage message={error} />
      ) : !hasEvents ? (
        <EmptyState message="No recent public activity found." />
      ) : (
        <ul className="activity-list">
          {visibleEvents.map((event, index) => {
            const Icon = getEventIcon(event.type)

            return (
              <li key={event.id || index} className="activity-item">
                <span className="activity-icon" aria-hidden="true">
                  <Icon />
                </span>
                <div className="activity-body">
                  <p className="activity-title">{describeEvent(event)}</p>
                  <p className="activity-when">{formatWhen(event)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}