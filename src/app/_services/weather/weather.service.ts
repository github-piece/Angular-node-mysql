import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '665d48140dca13e411595586a256c4ce';
  unit = 'metric';
  weatherModels: WeatherModel[] = [];
  constructor(private http: HttpClient) { }

  getCurrentWeather(city): Observable<WeatherModel> {
    const existing = this.weatherModels.find(w => w.city.toLocaleLowerCase() === city.toLocaleLowerCase());
    if (existing) {
      return of(existing);
    }
    const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${this.unit}&APPID=${this.apiKey}`;
    return this.http.get<any>(apiCall).pipe(map(resp => {
      const weather = resp.weather[0];
      const temp = resp.main.temp;
      const sunrise = resp.sys.sunrise * 1000;
      const sunset = resp.sys.sunset * 1000;
      const model = new WeatherModel(city, getWeatherType(weather.id), weather.description, temp, new Date(sunrise), new Date(sunset));
      this.weatherModels.push(model);
      return model;
    }));
  }
}
export class WeatherModel {
  constructor(readonly city: string, readonly type: WeatherType, readonly description: string,
              readonly temperature: number, readonly sunrise: Date, readonly sunset: Date) {
  }
}
function getWeatherType(weatherId: number): WeatherType {
  if (weatherId >= 200 && weatherId < 300) {
    return WeatherType.lightning;
  }
  if (weatherId >= 300 && weatherId < 600) {
    return WeatherType.rain;
  }
  if (weatherId >= 600 && weatherId < 700) {
    return WeatherType.snow;
  }
  if (weatherId >= 700 && weatherId < 800) {
    return WeatherType.fog;
  }
  if (weatherId === 800) {
    return WeatherType.clear;
  }
  if (weatherId === 801) {
    return WeatherType.partialClear;
  }
  if (weatherId >= 801 && weatherId < 900) {
    return WeatherType.cloud;
  }
  return WeatherType.unknown;
}
export enum WeatherType {
  cloud,
  fog,
  clear,
  rain,
  partialClear,
  lightning,
  snow,
  unknown
}
@Injectable()
export class DevelopmentWeatherService {
  getCurrentWeather(city: string): Observable<WeatherModel> {
    const sunrise = new Date();
    sunrise.setHours(sunrise.getHours() - 2);
    const sunset = new Date();
    sunset.setHours(sunset.getHours() + 2);
    const weather = new WeatherModel(city, WeatherType.clear, 'clear', 12.2, sunrise, sunset);
    return of(weather).pipe(delay(1000));
  }
}
export function weatherServiceFactory(httpClient: HttpClient) {
  let service: any;
  service = new WeatherService(httpClient);
  return service;
}
