import { useState, useEffect } from 'react'
import useFetch from './useFetch.js'
import {
  getGithubEventsUrl,
  getGithubReposUrl,
  getGithubUserUrl,
  githubStatusMessage,
} from '../services/githubService.js'
import githubCache from '../services/githubCache.js'

const githubOptions = { statusMessage: githubStatusMessage }

export default function useGithub() {
  const [submitted, setSubmitted] = useState('')
  const [cachedData, setCachedData] = useState(null)
  const [isStale, setIsStale] = useState(false)

  const profileFetch = useFetch(
    submitted && (!cachedData || isStale) ? getGithubUserUrl(submitted) : '',
    githubOptions,
  )
  const activityFetch = useFetch(
    submitted && (!cachedData || isStale) ? getGithubEventsUrl(submitted) : '',
    githubOptions,
  )
  const reposFetch = useFetch(
    submitted && (!cachedData || isStale) ? getGithubReposUrl(submitted) : '',
    githubOptions,
  )

  useEffect(() => {
    if (!submitted) return

    if (
      profileFetch.data &&
      activityFetch.data &&
      reposFetch.data
    ) {
      githubCache.set(submitted, {
        profile: profileFetch.data,
        events: activityFetch.data,
        repos: reposFetch.data,
      })
      setIsStale(false)
    }
  }, [
    submitted,
    profileFetch.data,
    activityFetch.data,
    reposFetch.data,
  ])

  function search(username) {
    const normalizedUsername = username.trim().toLowerCase()

    if (!normalizedUsername) return

    const cached = githubCache.get(normalizedUsername)
    const stale = githubCache.getStale(normalizedUsername)

    if (cached) {
      setCachedData(cached)
      setIsStale(false)
    } else if (stale) {
      setCachedData(stale)
      setIsStale(true)
    } else {
      setCachedData(null)
      setIsStale(false)
    }

    setSubmitted(normalizedUsername)
  }

  return {
    profile: profileFetch.data ?? cachedData?.profile,
    profileLoading: profileFetch.loading,
    profileError: profileFetch.error,
    events: Array.isArray(activityFetch.data) ? activityFetch.data : Array.isArray(cachedData?.events) ? cachedData.events : [],
    activityLoading: activityFetch.loading,
    activityError: activityFetch.error,
    repos: Array.isArray(reposFetch.data) ? reposFetch.data : Array.isArray(cachedData?.repos) ? cachedData.repos : [],
    reposLoading: reposFetch.loading,
    reposError: reposFetch.error,
    search,
  }
}