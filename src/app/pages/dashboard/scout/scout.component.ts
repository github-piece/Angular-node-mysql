import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {UserService} from '../../../_services/user/user.service';
import {MatTableDataSource, PageEvent} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {NgxSpinnerService} from 'ngx-spinner';
import {PayfastService} from '../../../_services/payfast/payfast.service';
@Component({
  selector: 'app-scout',
  templateUrl: './scout.component.html',
  styleUrls: ['./scout.component.css']
})
export class ScoutComponent implements OnInit {
  userData;
  profileData: any = [];
  profileQuiz = '';
  onShow = false;
  businessData: any;
  dataSource: any;
  tasks: any[];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  scoutProfile = [
    {title: 'All', value: 'Scouter_Profile', img: 'assets/lists/list1.jpg'},
    {title: 'Community Profile', value: 'Community_Profile', img: 'assets/lists/list2.jpeg'},
    {title: 'Maritime Profile', value: 'Maritime_Expert', img: 'assets/lists/list3.jpeg'},
    {title: 'Nature Profile', value: 'Nature_Expert_Profile', img: 'assets/lists/list4.jpeg'},
    {title: 'Security Profile', value: 'Security_Profile', img: 'assets/lists/list1.jpg'},
    {title: 'Healthcare Profile', value: 'Healthcare Centre', img: 'assets/lists/list2.jpeg'},
    {title: 'Economic Profile', value: 'Economic_Profile', img: 'assets/lists/list3.jpeg'},
    {title: 'Educational Profile', value: 'Educational Centre', img: 'assets/lists/list4.jpeg'},
    {title: 'SupraNational Profile', value: 'SupraNational_Profile', img: 'assets/lists/list1.jpg'}
  ];
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private payfastService: PayfastService
  ) { }
  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.spinner.show();
    this.userService.getScoutProfile(this.userData.userId).subscribe(result => {
      this.spinner.hide();
      this.profileData = result.scoutData;
      this.businessData = result.businessData;
      this.getTasks();
      this.getProfile();
    });
  }
  getProfile() {
    for (const profile of this.scoutProfile) {
      for (const data of this.profileData) {
        if (data.type === profile.value) {
          this.profileQuiz += profile.title + ', ';
        }
      }
    }
    this.profileQuiz = this.profileQuiz.substr(0, this.profileQuiz.length - 2);
    this.onShow = true;
  }
  getBusiness(id: any) {
    const count  = this.currentPage * this.pageSize + id;
    console.log(this.businessData[count].business_id);
  }
  getTasks() {
    const data = this.businessData;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.tasks = data;
    this.totalSize = this.tasks.length;
    this.iterator();
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
}
