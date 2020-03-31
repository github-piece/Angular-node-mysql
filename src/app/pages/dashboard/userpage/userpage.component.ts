import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../_helpers/must-match';
import {UserService} from '../../../_services/user/user.service';
import {MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {UserCreateModalComponent} from './usercreate.component';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  rowData: any;
  myData: any;
  registerForm: FormGroup;
  uAccountRadioVal: any;
  freezeFlag: any;
  onShow = false;
  submitted = false;
  imagePath: any;
  file: File = null;
  uploadImageShow = false;
  dataSource: any;
  tasks: any[];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, {static : false}) paginator: MatPaginator;
  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.registerForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  ngOnInit() {
    this.myData = this.authenticationService.currentUserSubject.value;
    this.getFreezeFlag(this.myData.userId);
    switch (this.myData.useraccounttype) {
      case 'Super Admin':
        this.uAccountRadioVal = 'Senior Admin';
        break;
      case 'Senior Admin':
        this.uAccountRadioVal = 'Junior Admin';
        break;
      case 'Junior Admin':
        this.uAccountRadioVal = 'User';
        break;
      case 'Moderator':
        this.uAccountRadioVal = 'User';
        break;
    }
    this.getUserList();
  }
  getFreezeFlag(userId) {
    this.userService.getFreezeFlag(userId).subscribe(result => this.freezeFlag = result.u_freezedflag );
  }
  getUserList() {
    this.userService.getUserList(this.myData.useraccounttype, this.myData.userId)
      .subscribe(result => {
        this.rowData = result;
        this.getSelect();
      });
  }
  getSelect() {
    let selectedRole;
    for (const data of this.rowData) {
      switch (data.u_accounttype) {
        case 'Senior Admin':
          selectedRole = 'Senior Admin'; break;
        case 'Junior Admin':
          selectedRole = 'Junior Admin'; break;
        case 'Moderator':
          selectedRole = 'Moderator'; break;
        default:
          selectedRole = 'User'; break;
      }
      data.selected = selectedRole;
    }
    this.getTasks();
  }
  getTasks() {
    const data = this.rowData;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.tasks = data;
    this.totalSize = this.tasks.length;
    this.iterator();
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
      this.myData.useravatar = reader.result;
    };
    this.file = event.files.item(0);
    this.uploadImageShow = true;
    const formData = new FormData();
    formData.append('userId', this.myData.userId);
    formData.append('file', this.file);
    formData.append('action', 'upload');
    this.userService.uploadPhoto(formData)
      .subscribe(result => console.log(result));
  }
  onChange() {
    if (this.myData.provider) {
    } else {
      this.onShow = !this.onShow;
    }
  }
  onSubmit() {
    if (this.registerForm.get('oldPassword').value !== this.myData.userpassword) {
      this.registerForm.controls.oldPassword.setErrors({notMatch: true});
    } else {
      this.registerForm.controls.oldPassword.setErrors(null);
    }
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.changePwd(this.f.confirmPassword.value, this.myData.userId, this.myData.useraccounttype, this.myData.useremail)
      .subscribe(result => {
        this.authenticationService.reset(result.userData);
      });
  }
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.tasks.slice(start, end);
    this.dataSource = part;
  }
  handlePage(event?: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }
  addUser() {
    const dialogRef = this.dialog.open(UserCreateModalComponent, {
      autoFocus: false,
      width: '600px',
      data: {type: this.myData.useraccounttype, val: this.uAccountRadioVal, id: this.myData.userId}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUserList();
    });
  }
  freezeUser(userId, param) {
    this.userService.freezeUser(this.myData.userId, this.myData.accounttype, userId, param).subscribe();
  }
  changeRole(event, selectedId) {
    this.userService.updateUser(this.myData.useraccounttype, selectedId, event.value).subscribe();
  }
}
