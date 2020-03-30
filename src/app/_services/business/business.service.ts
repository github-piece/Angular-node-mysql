import { Injectable } from '@angular/core';
import {Server} from '../../../config/url.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }
  getBusinessList(userId) {
    return this.http.post<any>(`${Server}/business`, {userId});
  }
  getGeometry(address) {
    return this.http.post<any>(`${Server}/getGeometry`, {address});
  }
}
