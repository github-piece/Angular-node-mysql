import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalServer, Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class PayfastService {

  constructor(private http: HttpClient) { }
  generateSignature(formData) {
    return this.http.post<any>(`${LocalServer}/generateSignature`, formData);
  }
}
