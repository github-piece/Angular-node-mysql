import { Injectable } from '@angular/core';
import {Server} from '../../../config/url.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }
  getArticleList(formData) {
    return this.http.post<any>(`${Server}/getArticleList`, formData);
  }
  getArticle(userId, accountType) {
    return this.http.post<any>(`${Server}/getArticle`, {accountType, userId});
  }
  setArticle(formData) {
    return this.http.post<any>(`${Server}/setArticle`, formData);
  }
}
