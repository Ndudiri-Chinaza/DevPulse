import { useState } from 'react'
import { FaGithub, FaUserAstronaut } from 'react-icons/fa'
import useGithub from '../../hooks/useGithub.js'
import EmptyState from '../UI/EmptyState.jsx'
import ErrorMessage from '../UI/ErrorMessage.jsx'
import Loading from '../UI/Loading.jsx'
import GithubActivity from './GithubActivity.jsx'
import GithubRepos from './GithubRepos.jsx'
import GithubSearchForm from './GithubSearchForm.jsx'
import GithubStats from './GithubStats.jsx'
import './Github.css'

export default function GithubSection() {
  const github = useGithub()
  const [formError, setFormError] = useState('')

  function handleSearch(username) {
    if (!username) {
      setFormError('Please enter a GitHub username.')
      return
    }

    setFormError('')
    github.search(username)
  }

  return (
    <div className="github-section">
      <div className="section-header">
        <h2 className="section-heading">
          <FaGithub aria-hidden="true" />
          GitHub
        </h2>

        <GithubSearchForm onSearch={handleSearch} />
      </div>

      {formError && <ErrorMessage message={formError} />}

      {github.profile ? (
        <div className="github-cards">
          <GithubStats user={github.profile} />
          <GithubActivity
            events={github.events}
            loading={github.activityLoading}
            error={github.activityError}
          />
          <GithubRepos
            repos={github.repos}
            loading={github.reposLoading}
            error={github.reposError}
          />
        </div>
      ) : github.profileLoading ? (
        <Loading message="Loading GitHub data..." />
      ) : github.profileError ? (
        <ErrorMessage message={github.profileError} />
      ) : !formError ? (
        <EmptyState
          message="Enter a GitHub username to see stats and recent activity."
          icon={<FaUserAstronaut />}
        />
      ) : null}
    </div>
  )
}