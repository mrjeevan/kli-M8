import { API_CONFIG } from "./config";
import {
  ICoordinate,
  IForecastData,
  IGeocodingResponse,
  IWeatherData,
} from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather api error : ${response.statusText}`);
    }
    return response.json();
  }
  async getCurrentWeather({ lat, lon }: ICoordinate): Promise<IWeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });

    return this.fetchData<IWeatherData>(url);
  }
  async getForecast({ lat, lon }: ICoordinate): Promise<IForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });

    return this.fetchData<IForecastData>(url);
  }
  async reverseGeocode({
    lat,
    lon,
  }: ICoordinate): Promise<IGeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    });

    return this.fetchData<IGeocodingResponse[]>(url);
  }
  async searchLocations(query: string): Promise<IGeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: "5",
    });

    return this.fetchData<IGeocodingResponse[]>(url);
  }
}

export const weatherApi = new WeatherAPI();
