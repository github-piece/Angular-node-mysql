import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../_model/user';
import {Server} from '../../../config/url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  register(user: User) {
    return this.http.post<any>(`${Server}/registerUser`, user);
  }
  getFreezeFlag(userId) {
    return this.http.post<any>(`${Server}/userFreezeFlag`, {userId});
  }
  getUserList(accountType, userId) {
    return this.http.post<any>(`${Server}/getUserList`, {accountType, userId});
  }
  uploadPhoto(formData: FormData) {
    return this.http.post<any>(`${Server}/uploadPhoto`, formData);
  }
  changePwd(confirmPassword, userId, accountType, userEmail) {
    return this.http.post<any>(`${Server}/changePwd`, {confirmPassword, userId, accountType, userEmail});
  }
  createUser(formData) {
    return this.http.post<any>(`${Server}/createUser`, formData);
  }
  freezeUser(userId, accountType, selectedId, state) {
    return this.http.post<any>(`${Server}/freezeUser`, {userId, accountType, selectedId, state});
  }
  updateUser(accountType, selectedId, radioAccountType) {
    return this.http.post<any>(`${Server}/updateUser`, {accountType, selectedId, radioAccountType});
  }
  getScoutProfile(userId) {
    return this.http.post<any>(`${Server}/getScoutProfile`, {userId});
  }
}
