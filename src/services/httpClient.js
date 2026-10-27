const DEFAULT_STATUS_MESSAGES = new Map([
  [404, 'Not found.'],
  [403, 'Rate limit reached. Please try again later.'],
  [429, 'Rate limit reached. Please try again later.'],
])

export function getStatusMessage(status, customStatusHandler) {
  if (customStatusHandler) {
    if (typeof customStatusHandler === 'function') {
      const custom = customStatusHandler(status)
      if (custom) return custom
    } else if (customStatusHandler instanceof Map && customStatusHandler.has(status)) {
      return customStatusHandler.get(status)
    } else if (typeof customStatusHandler === 'object' && customStatusHandler[status]) {
      return customStatusHandler[status]
    }
  }

  if (DEFAULT_STATUS_MESSAGES.has(status)) {
    return DEFAULT_STATUS_MESSAGES.get(status)
  }

  if (status >= 500) {
    return 'Server error. Please try again later.'
  }

  return `Request failed (${status}).`
}

const NETWORK_ERROR = 'DevPulseNetworkError'

// `fetch` rejects with a TypeError for real transport failures, but a TypeError
// can equally come from a bug in our own code. Tagging at the call site lets
// normalizeError tell those two cases apart.
export function createNetworkError(cause) {
  const error = new Error('Network error. Please check your connection.', {
    cause,
  })
  error.code = NETWORK_ERROR
  return error
}

export function isNetworkError(err) {
  return err?.code === NETWORK_ERROR
}

export function normalizeError(err) {
  if (isNetworkError(err)) {
    return err.message
  }
  // Untagged TypeError = programming error, not connectivity. SyntaxError =
  // unparseable response body. Neither message is safe to show a user.
  if (err?.name === 'TypeError' || err?.name === 'SyntaxError') {
    return 'An unexpected error occurred.'
  }
  return err?.message || 'An unexpected error occurred.'
}

export async function fetchJson(url, options = {}) {
  const { signal, statusMessage } = options

  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    // Let aborts propagate untouched so callers can ignore them.
    if (err?.name === 'AbortError') throw err
    throw createNetworkError(err)
  }

  if (statusMessage && typeof statusMessage === 'function') {
    const customMessage = statusMessage(response.status)
    if (customMessage) throw new Error(customMessage)
  }

  if (!response.ok) {
    throw new Error(getStatusMessage(response.status, statusMessage))
  }

  try {
    return await response.json()
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    // 200 with an HTML/empty body (captive portal, proxy, truncated response).
    // The raw SyntaxError text is technical noise - never show it.
    throw new Error('Received an unexpected response from the server.')
  }
}
