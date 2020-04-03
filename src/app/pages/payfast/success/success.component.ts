import { Component, OnInit } from '@angular/core';
import {BuysellService} from '../../../_services/buysell/buysell.service';
import {Router} from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit() {
    this.payData = JSON.parse(localStorage.getItem('payData'));
    this.userData = this.authenticationService.currentUserSubject.value;
    this.userData.useravatar = Server + '/avatar/' + this.userData.useravatar;
  }
  setHistory() {
    const formData = new FormData();
    formData.append('userId', this.userData.userId);
    formData.append('businessId', this.payData.businessId);
    formData.append('balance', this.payData.balance);
    formData.append('amount', this.payData.amount);
    formData.append('fund', this.payData.fund);
    formData.append('rate', this.payData.rate);
    formData.append('frequency', this.payData.frequency);
    this.buysellService.setBuyHistory(formData).subscribe(() => {
      this.router.navigate(['/dashboard/catalogue']);
      localStorage.removeItem('payData');
    });
  }
}
