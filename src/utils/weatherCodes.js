import { createElement } from 'react'
import { safeLookup } from './guards.js'
import {
  FaBolt,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaCloudSun,
  FaSmog,
  FaSnowflake,
  FaSun,
  FaQuestion,
} from 'react-icons/fa'

export const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export const weatherIcons = {
  0: FaSun,
  1: FaCloudSun,
  2: FaCloud,
  3: FaCloud,
  45: FaSmog,
  48: FaSmog,
  51: FaCloudRain,
  53: FaCloudRain,
  55: FaCloudRain,
  56: FaCloudRain,
  57: FaCloudRain,
  61: FaCloudShowersHeavy,
  63: FaCloudShowersHeavy,
  65: FaCloudShowersHeavy,
  66: FaCloudShowersHeavy,
  67: FaCloudShowersHeavy,
  71: FaSnowflake,
  73: FaSnowflake,
  75: FaSnowflake,
  77: FaSnowflake,
  80: FaCloudShowersHeavy,
  81: FaCloudShowersHeavy,
  82: FaCloudShowersHeavy,
  85: FaSnowflake,
  86: FaSnowflake,
  95: FaBolt,
  96: FaBolt,
  99: FaBolt,
}

export function describeWeatherCode(code) {
  return safeLookup(weatherDescriptions, code, 'Unknown')
}

export function weatherIconForCode(code) {
  return safeLookup(weatherIcons, code, FaQuestion)
}

export default function WeatherIcon({ code, size = 22 }) {
  return createElement(weatherIconForCode(code), { size })
}