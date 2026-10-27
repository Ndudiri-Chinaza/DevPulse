import { fetchJson } from './httpClient.js'

export const CURRENT_UNITS = {
  temperature_2m: '°C',
  relative_humidity_2m: '%',
  wind_speed_10m: ' km/h',
}

export function getGeocodingUrl(city) {
  return (
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  )
}

export function getWeatherUrl(latitude, longitude) {
  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=auto&forecast_days=5`
  )
}

function validateGeocodingResult(data) {
  if (data && Array.isArray(data.results) && data.results.length > 0) {
    return null
  }
  return 'City not found.'
}

export async function geocodeCity(cityName, options = {}) {
  const url = getGeocodingUrl(cityName)
  const data = await fetchJson(url, options)
  const validationError = validateGeocodingResult(data)
  if (validationError) {
    throw new Error(validationError)
  }
  return data.results[0]
}

export async function fetchForecast(latitude, longitude, options = {}) {
  const url = getWeatherUrl(latitude, longitude)
  return fetchJson(url, options)
}
