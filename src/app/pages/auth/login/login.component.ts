import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }
  get f() {
    return this.loginForm.controls;
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      u_email: ['', [Validators.required, Validators.email]],
      u_password: ['', Validators.required]
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.login(this.f.u_email.value, this.f.u_password.value)
      .subscribe(data => {
        if (data === null) {
          this.snackBar.open('Information is not correct', '', {
            duration: 2000
          });
        } else {
          if (data.status === 1) {
            this.router.navigate(['/dashboard/overview']);
          } else {
            this.snackBar.open('Sorry, still you didn\'t register', '', {
              duration: 2000
            });
            console.clear();
          }
        }
      });
  }
  signInWithFB() {
  }
  signInWithTwitter() {
  }
  signInWithGoogle() {
  }
  signInWithLinkedIn() {
  }
}
