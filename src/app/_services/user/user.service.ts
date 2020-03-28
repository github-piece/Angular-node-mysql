import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../_model/user';
import {Server} from '../../../config/url.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  register(user: User) {
    return this.http.post<any>(`${Server}/registerUser`, user).pipe(map(result => result));
  }
}
