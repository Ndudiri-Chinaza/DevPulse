import {
  FaCodeBranch,
  FaExclamationCircle,
  FaGithub,
  FaPlus,
  FaStar,
} from 'react-icons/fa'
import { FaCodePullRequest } from 'react-icons/fa6'
import { capitalize } from './formatters.js'
import { safeLookup } from './guards.js'

export const EVENT_ICONS = {
  PushEvent: FaCodeBranch,
  CreateEvent: FaPlus,
  IssuesEvent: FaExclamationCircle,
  PullRequestEvent: FaCodePullRequest,
  WatchEvent: FaStar,
}

export const EVENT_TITLES = {
  PushEvent: (_event, repo) => `Pushed commits to ${repo}`,
  CreateEvent: (event, repo) =>
    `Created ${capitalize(event.payload?.ref_type) || 'item'} in ${repo}`,
  IssuesEvent: (event, repo) =>
    `${capitalize(event.payload?.action) || 'Opened'} an issue in ${repo}`,
  PullRequestEvent: (event, repo) =>
    `${capitalize(event.payload?.action) || 'Opened'} a pull request in ${repo}`,
  WatchEvent: (_event, repo) => `Starred ${repo}`,
}

export function getEventIcon(type) {
  return safeLookup(EVENT_ICONS, type, FaGithub)
}

export function describeEvent(event) {
  const repo = event.repo ? event.repo.name : 'a repository'
  const formatter = safeLookup(EVENT_TITLES, event.type, (_event, fallbackRepo) =>
    `${capitalize(event.type) || 'Activity'} in ${fallbackRepo}`,
  )

  return formatter(event, repo)
}
