export interface GeocodingLocation {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingLocation[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
}
