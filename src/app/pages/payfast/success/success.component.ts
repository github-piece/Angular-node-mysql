import { Component, OnInit } from '@angular/core';
import {BuysellService} from '../../../_services/buysell/buysell.service';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Server} from '../../../../config/url.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['../payfast.css']
})
export class SuccessComponent implements OnInit {
  payData: any;
  userData: any;
  constructor(
    private buysellService: BuysellService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.payData = JSON.parse(localStorage.getItem('payData'));
    localStorage.removeItem('payData');
    this.userData = this.authenticationService.currentUserSubject.value;
    this.userData.useravatar = Server + '/avatar/' + this.userData.useravatar;
  }
}
