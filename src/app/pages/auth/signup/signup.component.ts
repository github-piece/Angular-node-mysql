import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {MustMatch} from '../../../_helpers/must-match';
import {UserService} from '../../../_services/user/user.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  duplicate = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }
  get f() { return this.registerForm.controls; }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        u_name: ['', Validators.required],
        u_email: ['', [Validators.required, Validators.email]],
        u_phonenum: ['', Validators.required],
        u_password: ['', [Validators.required, Validators.minLength(6)]],
        u_confirmPassword: ['', Validators.required]},
      {
        validator: MustMatch('u_password', 'u_confirmPassword')
      });
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    return  this.userService.register(this.registerForm.value)
      .subscribe(result => {
        this.snackBar.open('Successfully registered!', '', {
          duration: 2000
        });
      }, error => {
        this.snackBar.open('Error!', '', {
          duration: 2000
        });
        console.clear();
      });
  }
}
