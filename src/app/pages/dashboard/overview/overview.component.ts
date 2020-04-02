import { Component, OnInit } from '@angular/core';
import {WeatherModel, WeatherService, WeatherType} from '../../../_services/weather/weather.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  myData: any;
  today: number = Date.now();
  weather: WeatherModel;
  weatherType = WeatherType;
  condition;
  city = 'London';
  failedToLoad: boolean;
  show = false;
  notifications = [];
  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.notifications = notifications;
    this.myData = this.authenticationService.currentUserSubject.value;
    this.getData();
  }
  getData() {
    this.route.paramMap.subscribe(() => {
      this.reset();
      this.weatherService.getCurrentWeather(this.city).subscribe(x => {
        this.weather = x;
        this.condition = WeatherType[x.type];
        this.spinner.hide(); this.show = true;
      }, () => { this.failedToLoad = true; this.spinner.hide(); this.show = true; });
    });
  }
  reset() {
    this.failedToLoad = false;
    this.weather = undefined;
  }
  isDay() {
    const now = new Date();
    return (this.weather.sunrise < now && this.weather.sunset > now);
  }
}
export const notifications = [
  {
    type: 'social',
    title: 'Social',
    text: 'Important Message',
    time: 'JUST NOW',
    icon: 'unsubscribe'
  },
  {
    type: 'alert',
    title: 'Removed 6 items...',
    text: 'Important Message',
    time: 'Yesterday',
    icon: 'error'
  }
];
