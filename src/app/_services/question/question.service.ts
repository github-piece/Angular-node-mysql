import { Injectable } from '@angular/core';
import {Server} from '../../../config/url.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }
  getBusinessQuiz(userId, profile) {
    return this.http.post<any>(`${Server}/getBusinessQuiz`, {userId, profile});
  }
  setAnswer(formData) {
    return this.http.post<any>(`${Server}/setBusinessAnswer`, formData);
  }
}
