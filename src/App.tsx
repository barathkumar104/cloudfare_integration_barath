import { FormEvent, useMemo, useState } from "react";
import { describeWeatherCode, fetchCoordinates, fetchForecast } from "./api";
import TemperatureChart from "./components/TemperatureChart";
import { ForecastResponse, GeocodingLocation } from "./types";

function buildRecommendation(weather: ForecastResponse): string {
  const currentTemp = weather.current_weather.temperature;
  const maxTemp = Math.max(...weather.daily.temperature_2m_max);
  const minTemp = Math.min(...weather.daily.temperature_2m_min);
  const totalRain = weather.daily.precipitation_sum.reduce((sum, value) => sum + value, 0);

  if (totalRain > 30) {
    return "Heavy rain expected this week. Keep backup indoor plans and carry rain gear.";
  }

  if (maxTemp >= 35) {
    return "High heat expected. Plan outdoor tasks early morning and stay hydrated.";
  }

  if (minTemp <= 8) {
    return "Cool temperatures expected. Carry warm layers for mornings and evenings.";
  }

  if (currentTemp >= 22 && currentTemp <= 30) {
    return "Weather looks favorable for regular commuting and outdoor activities.";
  }

  return "Mixed weather conditions expected. Check the daily forecast before planning.";
}

export default function App() {
  const [city, setCity] = useState("Chennai");
  const [resolvedLocation, setResolvedLocation] = useState<GeocodingLocation | null>(null);
  const [weather, setWeather] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendation = useMemo(() => {
    if (!weather) {
      return "Search a city to get a weather planning recommendation.";
    }

    return buildRecommendation(weather);
  }, [weather]);

  const weeklyRain = useMemo(() => {
    if (!weather) {
      return 0;
    }

    return weather.daily.precipitation_sum.reduce((sum, value) => sum + value, 0);
  }, [weather]);

  const warmestDay = useMemo(() => {
    if (!weather) {
      return "-";
    }

    let maxIndex = 0;
    weather.daily.temperature_2m_max.forEach((temp, index) => {
      if (temp > weather.daily.temperature_2m_max[maxIndex]) {
        maxIndex = index;
      }
    });

    return weather.daily.time[maxIndex];
  }, [weather]);

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = city.trim();
    if (!trimmed) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const location = await fetchCoordinates(trimmed);
      const forecast = await fetchForecast(location.latitude, location.longitude);
      setResolvedLocation(location);
      setWeather(forecast);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected weather lookup error.";
      setError(message);
      setWeather(null);
      setResolvedLocation(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <section className="hero">
        <p className="eyebrow">Weather Intelligence App</p>
        <h1>Plan Smarter with Live 7-Day Weather Insights</h1>
        <p className="subtext">
          Powered by Open-Meteo geocoding and forecast APIs. Search any city for current conditions,
          weekly trend, and simple planning guidance.
        </p>

        <div className="hero-points">
          <span>Public API Data Only</span>
          <span>Cloudflare Pages Ready</span>
          <span>Assignment L2 Compliant</span>
        </div>

        <form className="search" onSubmit={onSearch}>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Search city (example: Chennai, London)"
            aria-label="City search"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Get Weather"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="content">
        <article className="card">
          <h2>Current Weather</h2>
          {weather && resolvedLocation ? (
            <div className="current-weather">
              <p className="location">
                {resolvedLocation.name}
                {resolvedLocation.admin1 ? `, ${resolvedLocation.admin1}` : ""}
                {resolvedLocation.country ? `, ${resolvedLocation.country}` : ""}
              </p>
              <p className="temp">{weather.current_weather.temperature.toFixed(1)} C</p>
              <p>{describeWeatherCode(weather.current_weather.weathercode)}</p>
              <p>Wind: {weather.current_weather.windspeed.toFixed(1)} km/h</p>
              <p>Timezone: {weather.timezone}</p>
            </div>
          ) : (
            <p className="placeholder">No weather loaded yet.</p>
          )}
        </article>

        <article className="card">
          <h2>Planning Recommendation</h2>
          <p className="recommendation">{recommendation}</p>
        </article>
      </section>

      <section className="metrics" aria-label="weekly weather summary">
        <article className="metric-card">
          <p>Weekly Rainfall</p>
          <h3>{weeklyRain.toFixed(1)} mm</h3>
        </article>
        <article className="metric-card">
          <p>Warmest Forecast Day</p>
          <h3>{warmestDay}</h3>
        </article>
        <article className="metric-card">
          <p>Current Condition</p>
          <h3>{weather ? describeWeatherCode(weather.current_weather.weathercode) : "Not loaded"}</h3>
        </article>
      </section>

      {weather && (
        <>
          <TemperatureChart
            labels={weather.daily.time}
            maxTemps={weather.daily.temperature_2m_max}
            minTemps={weather.daily.temperature_2m_min}
          />

          <section className="forecast-grid" aria-label="7 day forecast cards">
            {weather.daily.time.map((date, index) => (
              <article key={date} className="forecast-card">
                <p className="forecast-date">{date}</p>
                <p className="forecast-desc">{describeWeatherCode(weather.daily.weathercode[index])}</p>
                <p>Max: {weather.daily.temperature_2m_max[index].toFixed(1)} C</p>
                <p>Min: {weather.daily.temperature_2m_min[index].toFixed(1)} C</p>
                <p>Rain: {weather.daily.precipitation_sum[index].toFixed(1)} mm</p>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
