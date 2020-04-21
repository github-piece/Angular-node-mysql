import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class BuysellService {
  public businessId: any;
  public businessRemain: any;
  public businessName: any;
  public modalContent: any;
  public action: any;
  public commission: any;
  public fundTypes = [];
  constructor(private http: HttpClient) { }
  getBuyHistory(userId) {
    return this.http.post(`${Server}/getBuyHistory`, {userId});
  }
  getBusinessList(userId) {
    return this.http.post(`${Server}/getBusinessList`, {userId});
  }
}
