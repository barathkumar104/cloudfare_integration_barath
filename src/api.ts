import { ForecastResponse, GeocodingLocation, GeocodingResponse } from "./types";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";

export async function fetchCoordinates(city: string): Promise<GeocodingLocation> {
  const url = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to reach geocoding service.");
  }

  const payload: GeocodingResponse = await response.json();
  if (!payload.results || payload.results.length === 0) {
    throw new Error("City not found. Please enter a valid city name.");
  }

  return payload.results[0];
}

export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: "true",
    daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${FORECAST_API}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Unable to fetch weather forecast.");
  }

  return (await response.json()) as ForecastResponse;
}

export function describeWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };

  return map[code] ?? "Unknown conditions";
}
