import { useMemo, useState } from 'react'
import { FaCodeBranch, FaBook, FaSearch, FaStar } from 'react-icons/fa'
import Card from '../UI/Card.jsx'
import EmptyState from '../UI/EmptyState.jsx'
import ErrorMessage from '../UI/ErrorMessage.jsx'
import Loading from '../UI/Loading.jsx'
import { formatNumber } from '../../utils/formatters.js'
import { filterAndSortRepos } from '../../services/githubService.js'

export default function GithubRepos({ repos, loading, error }) {
  const [query, setQuery] = useState('')
  const hasRepos = repos.length > 0
  const isRefreshing = loading && hasRepos
  const hasRefreshError = Boolean(error) && hasRepos


  const visibleRepos = useMemo(
    () => filterAndSortRepos(repos, query),
    [repos, query],
  )

  if (loading && !hasRepos) {
    return (
      <Card className="github-repos-card" title="Repositories" icon={<FaCodeBranch />}>
        <Loading message="Loading repositories..." />
      </Card>
    )
  }

  return (
    <Card className="github-repos-card" title="Repositories" icon={<FaCodeBranch />}>
      {isRefreshing && (
        <p className="refresh-status" role="status">Updating repositories...</p>
      )}
      {hasRefreshError && (
        <ErrorMessage message="Could not refresh repositories. Showing previously loaded data" />
      )}
      {error && !hasRefreshError ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <div className="repo-search">
            <FaSearch className="repo-search-icon" aria-hidden="true" />
            <label htmlFor="repo-search" className="visually-hidden">
              Filter repositories
            </label>
            <input
              id="repo-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter repositories..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {repos.length === 0 ? (
            <EmptyState message="No public repositories found." icon={<FaBook />} />
          ) : visibleRepos.length === 0 ? (
            <EmptyState message="No repositories match your search." />
          ) : (
            <ul className="repos-list">
              {visibleRepos.map((repo) => (
                <li key={repo.id} className="repo-item">
                  <div className="repo-info">
                    <a
                      className="repo-name"
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="repo-description">{repo.description}</p>
                    )}
                    <div className="repo-meta">
                      {repo.language && (
                        <span className="repo-meta-item">{repo.language}</span>
                      )}
                      <span className="repo-meta-item">
                        <FaStar aria-hidden="true" />
                        {formatNumber(repo.stargazers_count)}
                      </span>
                      <span className="repo-meta-item">
                        <FaCodeBranch aria-hidden="true" />
                        {formatNumber(repo.forks_count)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  )
}