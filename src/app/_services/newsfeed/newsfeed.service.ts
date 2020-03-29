import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Server} from '../../../config/url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  constructor(private  http: HttpClient) { }
  getArticleList(userId, accountType) {
    return this.http.post<any>(`${Server}/getArticle`, {accountType, userId}).pipe(map(result => result));
  }
}
