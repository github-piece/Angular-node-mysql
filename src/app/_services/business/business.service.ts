import { Injectable } from '@angular/core';
import {Server} from '../../../config/url.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }
  getBusinessList(userId) {
    return this.http.post<any>(`${Server}/business`, {userId}).pipe(map(result => result));
  }
  getGeometry(address) {
    return this.http.post<any>(`${Server}/getGeometry`, {address}).pipe(map(result => result));
  }
}
