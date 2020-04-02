import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Server} from '../../../../config/url.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {UserService} from '../../../_services/user/user.service';
import {MustMatch} from '../../../_helpers/must-match';

@Component({
  selector: 'app-user-create',
  templateUrl: './usercreate.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserCreateModalComponent implements OnInit {
  createForm: FormGroup;
  submitted = false;
  type: any;
  val: any;
  id: any;
  avatar = Server + '/avatar/default.png';
  imagePath: any;
  userPhoto: any;
  uploadImageShow = false;
  file: File = null;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserCreateModalComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.type = data.type;
    this.val = data.val;
    this.id = data.id;
    this.createForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  get f() { return this.createForm.controls; }
  ngOnInit() { }
  onSubmit() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    const formData =  new FormData();
    formData.append('name', this.f.userName.value);
    formData.append('email', this.f.userEmail.value);
    formData.append('password', this.f.password.value);
    formData.append('file', this.file);
    formData.append('adminId', this.id);
    this.userService.createUser(formData).subscribe(() => {
      this.snackBar.open('Successfully Created', '', {
        duration: 2000
      });
    }, () => {
      this.snackBar.open('Server error', '', {
        duration: 2000
      });
    });
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  preview(event) {
    const mimeType = event.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = event.files;
    reader.readAsDataURL(event.files[0]);
    reader.onload = () => {
      this.userPhoto = reader.result;
    };
    this.file = event.files.item(0);
    this.uploadImageShow = true;
  }
}
