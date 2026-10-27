// import { fetchJson } from './httpClient.js'

export const GITHUB_STATUS_MESSAGES = new Map([
  [404, 'GitHub user not found.'],
  [403, 'GitHub API rate limit reached. Please try again later.'],
  [429, 'GitHub API rate limit reached. Please try again later.'],
])

export function githubStatusMessage(status) {
  if (GITHUB_STATUS_MESSAGES.has(status)) {
    return GITHUB_STATUS_MESSAGES.get(status)
  }
  if (status >= 500) {
    return 'Something went wrong fetching GitHub data.'
  }
  return null
}

export function getGithubUserUrl(username) {
  return `https://api.github.com/users/${username}`
}

export function getGithubEventsUrl(username) {
  return `https://api.github.com/users/${username}/events/public`
}

export function getGithubReposUrl(username) {
  return `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
}

// export async function fetchGithubUser(username, options = {}) {
//   return fetchJson(getGithubUserUrl(username), {
//     ...options,
//     statusMessage: githubStatusMessage,
//   })
// }

// export async function fetchGithubEvents(username, options = {}) {
//   return fetchJson(getGithubEventsUrl(username), {
//     ...options,
//     statusMessage: githubStatusMessage,
//   })
// }

// export async function fetchGithubRepos(username, options = {}) {
//   return fetchJson(getGithubReposUrl(username), {
//     ...options,
//     statusMessage: githubStatusMessage,
//   })
// }

export function filterAndSortRepos(repos, query) {
  const trimmed = query.trim().toLowerCase()

  const filtered = trimmed
    ? repos.filter((repo) =>
      `${repo.name} ${repo.description ?? ''}`
        .toLowerCase()
        .includes(trimmed),
    )
    : repos

  return [...filtered].sort(
    (a, b) =>
      (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) ||
      (b.updated_at ?? '').localeCompare(a.updated_at ?? ''),
  )
}
