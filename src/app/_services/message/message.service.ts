import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }
  getMessage(userId) {
    return this.http.post<any>(`${Server}/getMessage`, {userId});
  }
  setMessage(businessId, userId) {
    return this.http.post<any>(`${Server}/setMessage`, {businessId, userId});
  }
  setAllMessage(userId) {
    return this.http.post<any>(`${Server}/setAllMessage`, {userId});
  }
}
