import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Router} from '@angular/router';
import {Server} from '../../../../config/url.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['../payfast.css']
})
export class CancelComponent implements OnInit {
  userData: any;
  payData: any;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.userData.useravatar = Server + '/avatar/' + this.userData.useravatar;
    this.payData = JSON.parse(localStorage.getItem('payData'));
  }
  return() {
    localStorage.removeItem('payData');
    this.router.navigate(['/dashboard/catalogue']);
  }
}
