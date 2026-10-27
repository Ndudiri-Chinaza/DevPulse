import { useEffect, useRef, useState } from 'react'
import { fetchJson, normalizeError } from '../services/httpClient.js'

export default function useFetch(url, options = {}) {
  const { validate, statusMessage } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  const previousUrlRef = useRef(url)
  const optionsRef = useRef({ validate, statusMessage })
  optionsRef.current = { validate, statusMessage }

  useEffect(() => {
    if (!url) {
      setData(null)
      setError(null)
      setLoading(false)
      return undefined
    }

    const urlChanged = previousUrlRef.current !== url
    previousUrlRef.current = url

    let cancelled = false
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    if (urlChanged) {
      setData(null)
    }

    async function load() {
      const { statusMessage: statusMessageFn, validate: validateFn } =
        optionsRef.current

      try {
        const responseData = await fetchJson(url, {
          signal: controller.signal,
          statusMessage: statusMessageFn,
        })

        if (cancelled) return

        if (validateFn) {
          const validationError = validateFn(responseData)

          if (validationError) {
            setError(validationError)
            if (urlChanged) {
              setData(null)
            }
            return
          }
        }

        setData(responseData)
      } catch (err) {
        if (cancelled || err?.name === 'AbortError') return
        setError(normalizeError(err))
        if (urlChanged) {
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [url, attempt])

  function refetch() {
    setAttempt((prev) => prev + 1)
  }

  return { data, loading, error, refetch }
}