import { useCallback, useEffect, useRef, useState } from 'react'
import { geocodeCity, fetchForecast } from '../services/weatherService.js'
import { formatLocation } from '../utils/formatters.js'

export default function useWeather() {
  const [coords, setCoords] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeController = useRef(null)
  const coordsRef = useRef(null)
  coordsRef.current = coords
  const DEFAULT_CITY = "Enugu"

  const search = useCallback(async (cityName) => {
    const trimmed = cityName.trim()
    if (!trimmed) return

    if (activeController.current) {
      activeController.current.abort()
    }
    const controller = new AbortController()
    activeController.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const matchedCoords = await geocodeCity(trimmed, {
        signal: controller.signal,
      })
      setCoords(matchedCoords)

      const forecast = await fetchForecast(
        matchedCoords.latitude,
        matchedCoords.longitude,
        { signal: controller.signal },
      )
      setWeatherData(forecast)
    } catch (err) {
      if (err?.name === 'AbortError') return
      setError(err.message || 'Failed to fetch weather.')
      setWeatherData(null)
    } finally {
      if (activeController.current === controller) {
        setIsLoading(false)
        activeController.current = null
      }
    }
  }, [])

  useEffect(() => {
    search(DEFAULT_CITY);
  }, [search])

  const refresh = useCallback(async () => {
    const currentCoords = coordsRef.current
    if (!currentCoords) return

    if (activeController.current) {
      activeController.current.abort()
    }
    const controller = new AbortController()
    activeController.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const forecast = await fetchForecast(
        currentCoords.latitude,
        currentCoords.longitude,
        { signal: controller.signal },
      )
      setWeatherData(forecast)
    } catch (err) {
      if (err?.name === 'AbortError') return
      setError(err.message || 'Failed to refresh weather.')
    } finally {
      if (activeController.current === controller) {
        setIsLoading(false)
        activeController.current = null
      }
    }
  }, [])

  const hasCoords = Boolean(coords)

  return {
    current: weatherData?.current,
    daily: weatherData?.daily,
    hasWeatherData: Boolean(weatherData),
    displayCity: hasCoords ? formatLocation(coords) : '',
    hasCoords,
    isLoading,
    error,
    search,
    refresh,
  }
}