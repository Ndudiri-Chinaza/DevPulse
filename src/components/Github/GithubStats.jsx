import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import Card from '../UI/Card.jsx'

export default function GithubStats({ user }) {
  return (
    <Card className="github-stats-card">
      <div className="github-profile">
        <img
          className="github-avatar"
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          width={72}
          height={72}
        />
        <div className="github-profile-info">
          <h3 className="github-name">{user.name || user.login}</h3>
          <a
            className="github-handle"
            href={user.html_url}
            target="_blank"
            rel="noreferrer noopener"
          >
            @{user.login}
            <FaExternalLinkAlt aria-hidden="true" />
          </a>
          {user.bio && <p className="github-bio">{user.bio}</p>}
        </div>
      </div>

      <dl className="github-stats">
        <div className="github-stat">
          <dt>Repos</dt>
          <dd>{user.public_repos}</dd>
        </div>
        <div className="github-stat">
          <dt>Followers</dt>
          <dd>{user.followers}</dd>
        </div>
        <div className="github-stat">
          <dt>Following</dt>
          <dd>{user.following}</dd>
        </div>
      </dl>

      <span className="github-card-icon" aria-hidden="true">
        <FaGithub />
      </span>
    </Card>
  )
}