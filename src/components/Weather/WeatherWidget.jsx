import { useState } from 'react'
import {
  FaCloudSun,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaTint,
  FaWind,
} from 'react-icons/fa'
import useWeather from '../../hooks/useWeather.js'
import WeatherIcon, { describeWeatherCode } from '../../utils/weatherCodes.js'
import { formatDay } from '../../utils/formatters.js'
import { CURRENT_UNITS } from '../../services/weatherService.js'
import Card from '../UI/Card.jsx'
import EmptyState from '../UI/EmptyState.jsx'
import ErrorMessage from '../UI/ErrorMessage.jsx'
import Loading from '../UI/Loading.jsx'
import './Weather.css'

export default function WeatherWidget() {
  const weather = useWeather()
  const [city, setCity] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = city.trim()

    if (!trimmed) return

    weather.search(trimmed)
  }

  const { current, daily } = weather

  return (
    <div className="weather-section">
      <div className="section-header">
        <h2 className="section-heading">
          <FaCloudSun aria-hidden="true" />
          Weather
        </h2>
      </div>

      <Card className="weather-card">
        <div className="weather-form-row">
          <form className="weather-form" onSubmit={handleSubmit}>
            <label htmlFor="weather-city" className="visually-hidden">
              City
            </label>
            <input
              id="weather-city"
              className="text-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter a city"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {weather.hasCoords && weather.hasWeatherData && (
            <button
              type="button"
              className="icon-button"
              onClick={weather.refresh}
              disabled={weather.isLoading}
              aria-label="Refresh weather"
              title="Refresh weather"
            >
              <FaSyncAlt aria-hidden="true" />
            </button>
          )}
        </div>

        {weather.isLoading && !current && <Loading message="Loading weather..." />}

        {weather.error && <ErrorMessage message={weather.error} />}

        {weather.hasCoords && current && (
          <>
            <div className="weather-current">
              <span className="weather-icon" aria-hidden="true">
                <WeatherIcon code={current.weather_code} size={44} />
              </span>
              <div className="weather-current-info">
                <p className="weather-temp">
                  {Math.round(current.temperature_2m)}
                  {CURRENT_UNITS.temperature_2m}
                </p>
                <p className="weather-desc">
                  {describeWeatherCode(current.weather_code)}
                </p>
                <p className="weather-city">
                  <FaMapMarkerAlt aria-hidden="true" />
                  {weather.displayCity}
                </p>
              </div>
            </div>

            <dl className="weather-details">
              <div>
                <dt>
                  <FaTint aria-hidden="true" />
                  Humidity
                </dt>
                <dd>
                  {current.relative_humidity_2m}
                  {CURRENT_UNITS.relative_humidity_2m}
                </dd>
              </div>
              <div>
                <dt>
                  <FaWind aria-hidden="true" />
                  Wind
                </dt>
                <dd>
                  {current.wind_speed_10m}
                  {CURRENT_UNITS.wind_speed_10m}
                </dd>
              </div>
            </dl>
          </>
        )}

        {weather.hasCoords && daily && daily.time.length > 0 && (
          <div className="weather-forecast">
            <h3 className="weather-forecast-title">Forecast</h3>
            <ul className="weather-days">
              {daily.time.map((day, index) => (
                <li key={day} className="weather-day">
                  <span className="weather-day-name">
                    {formatDay(day, index)}
                  </span>
                  <span className="weather-day-icon" aria-hidden="true">
                    <WeatherIcon code={daily.weather_code[index]} size={20} />
                  </span>
                  <span className="weather-day-temps">
                    <span className="weather-high">
                      {Math.round(daily.temperature_2m_max[index])}°
                    </span>
                    <span className="weather-low">
                      {Math.round(daily.temperature_2m_min[index])}°
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!weather.isLoading && !weather.error && !weather.hasCoords && (
          <EmptyState
            message="Enter a city to see current weather and forecast."
            icon={<FaMapMarkerAlt />}
          />
        )}

        {!weather.isLoading && !weather.error && weather.hasCoords && !current && (
          <EmptyState message="Weather data is unavailable right now." />
        )}
      </Card>
    </div>
  )
}