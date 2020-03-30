import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class BuysellService {

  constructor(private http: HttpClient) { }
  getBuyHistory(userId) {
    return this.http.post(`${Server}/getBuyHistory`, {userId});
  }
  getSellHistory(userId) {
    return this.http.post(`${Server}/getSellHistory`, {userId});
  }
}
