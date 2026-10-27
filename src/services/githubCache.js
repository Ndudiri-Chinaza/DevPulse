const CACHE_TTL = 10 * 1000

const githubCache = new Map()

function set(username, data) {
    githubCache.set(username, {
        data,
        timestamp: Date.now()
    })
}

function get(username) {
    const entry = githubCache.get(username)

    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp >= CACHE_TTL

    if (isExpired) {
        return null
    }
    return entry.data
}

function getStale(username) {
    const entry = githubCache.get(username)

    if (!entry) return null

    return entry.data
}

export default { get, set, getStale }

// const TTL_MS = 5 * 60 * 1000

// const entries = new Map()

// function isExpired(entry, now) {
//   return now - entry.storedAt >= TTL_MS
// }

// function pruneExpired(now) {
//   for (const [key, entry] of entries) {
//     if (isExpired(entry, now)) {
//       entries.delete(key)
//     }
//   }
// }

// function get(username) {
//   const entry = entries.get(username)

//   if (!entry) {
//     return null
//   }

//   const now = Date.now()

//   if (isExpired(entry, now)) {
//     entries.delete(username)
//     return null
//   }

//   return entry.data
// }

// function set(username, data) {
//   const now = Date.now()

//   pruneExpired(now)
//   entries.set(username, { data, storedAt: now })
// }

// function clear() {
//   entries.clear()
// }

// const githubCache = { get, set, clear }

// export default githubCache