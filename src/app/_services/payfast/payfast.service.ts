import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class PayfastService {

  constructor(private http: HttpClient) { }
  generateSignature(formData) {
    return this.http.post<any>(`${Server}/generateSignature`, formData);
  }
}
