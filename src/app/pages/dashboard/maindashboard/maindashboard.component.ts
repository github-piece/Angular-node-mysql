import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Router} from '@angular/router';
import {Server} from '../../../../config/url.service';

@Component({
  selector: 'app-maindashboard',
  templateUrl: './maindashboard.component.html',
  styleUrls: ['./maindashboard.component.css']
})
export class MaindashboardComponent implements OnInit {
  userData: any = [];
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    if (this.userData == null) {
      this.router.navigate(['/login']);
    }
    this.userData.useravatar = Server + '/' + this.userData.useravatar;
    console.log(this.userData);
  }

}
