import { Injectable } from '@angular/core';
import {PhpServer, Server} from '../../../config/url.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private http: HttpClient) { }
  getBusinessList(userId, action) {
    return this.http.post<any>(`${Server}/getCategory`, {userId, action});
  }
  getTabData(userId, business, tab) {
    return this.http.post<any>(`${Server}/getTabData`, {userId, business, tab});
  }
  setBusinessByExcel(userId, questionTypeID) {
    const action = 'createByExcel';
    return this.http.post<any>(`${PhpServer}/catalogue.php`, {userId, questionTypeID, action});
  }
  setBusinessList(userId, questionTypeID) {
    const action = 'create';
    return this.http.post<any>(`${PhpServer}/catalogue.php`, {userId, questionTypeID, action});
  }
  populateForm() {
  }
}
