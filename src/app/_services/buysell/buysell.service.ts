import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class BuysellService {
  public rowData: any = [];
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
  getSellHistory(userId) {
    return this.http.post(`${Server}/getSellHistory`, {userId});
  }
  setBuyHistory(formData) {
    return this.http.post(`${Server}/setBuyHistory`, formData);
  }
}
