import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {BusinessService} from '../../../_services/business/business.service';
import {Server} from '../../../../config/url.service';
import {MatPaginator} from '@angular/material/paginator';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatTab, MatTableDataSource, PageEvent} from '@angular/material';
@Component({
  selector: 'app-maindashboard',
  templateUrl: './maindashboard.component.html',
  styleUrls: ['./maindashboard.component.css']
})
export class MaindashboardComponent implements OnInit {
  displayedColumns: string[] = ['no', 'name', 'location', 'address'];
  public charts: Array<{
    title: string;
    type: string;
    data: Array<Array<string | number | {}>>;
    roles?: Array<{ type: string; role: string; index?: number }>;
    columnNames?: Array<string>;
    options?: {};
    length: number;
  }> = [];
  lat: number;
  lng: number;
  zoom = 2;
  userData: any = [];
  businessData = [];
  mapData = [];
  businessList = [['treeMap', null, 0, 0]];
  tenureList = [];
  goalList = [];
  tableData = [];
  onShow = false;
  dataSource: any;
  elements: any[];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private authenticationService: AuthenticationService,
    private businessService: BusinessService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit() {
    this.spinner.show();
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getBusiness(this.userData.userId);
  }
  getBusiness(userId) {
    this.businessService.getBusinessList(userId)
      .subscribe(data => {
        this.businessData = data;
        this.mainProcess();
      });
  }
  mainProcess() {
    this.onAddressAll();
    this.setBusinessList();
    this.chartSet();
    this.onShow = true;
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  onAddress(businessId) {
    this.mapData = [];
    for (const business of this.businessData) {
      if (business.id === businessId) {
        this.mapData[0] = business;
        this.lng = business.lng;
        this.lat = business.lat;
        break;
      }
    }
  }
  onAddressAll() {
    this.lat = 0; this.lng = 0;
    this.mapData = this.businessData;
    for (const business of this.businessData) {
      if (business.pic.substr(0, 4) !== 'http') {
        business.pic = Server + '/business/' + business.pic;
      }
      this.lat += business.lat;
      this.lng += business.lng;
    }
    this.lat /= this.businessData.length; this.lng /= this.businessData.length;
  }
  setBusinessList() {
    let businessArray = [];
    for (const business of this.businessData) {
      const businessValue = business.business.split(',');
      businessArray = businessArray.concat(businessValue);
    }
    const businessArrayName = businessArray.filter((v, i, a) => a.indexOf(v) === i);
    for (let j = 0; j < businessArrayName.length; j++) {
      this.businessList[j + 1] = [businessArrayName[j], 'treeMap', 0, businessArrayName.length - j - 1];
      for (const business of businessArray) {
        if (businessArrayName[j] === business) {
          this.businessList[j + 1][2] = Number(this.businessList[j + 1][2]) + 1;
        }
      }
    }
  }
  chartSet() {
    this.charts.push({
      title: 'Businesses listed by Industry',
      type: 'TreeMap',
      data: this.businessList,
      options: {
        minColor: '#f44336',
        midColor: '#ffc107',
        maxColor: '#00c853',
        headerHeight: 0,
        showScale: false
      },
      length: 3
    });

    let goalArray = []; let tenureArray = [];
    for (let j = 0; j < this.businessData.length; j++) {
      const goalValue = this.businessData[j].goal.split(',');
      goalArray = goalArray.concat(goalValue);
      tenureArray = tenureArray.concat(this.businessData[j].tenure);
      this.tableData[j] = {
        no: this.businessData[j].no,
        name: this.businessData[j].name,
        location: this.businessData[j].country,
        address: this.businessData[j].address
      };
    }
    const tenureArrayName = tenureArray.filter((v, i, a) => a.indexOf(v) === i);
    for (let j = 0; j < tenureArrayName.length; j++) {
      this.tenureList[j] = [tenureArrayName[j], 0];
      for (const business of this.businessData) {
        if (tenureArrayName[j] === business.tenure) {
          this.tenureList[j][1] += parseFloat(business.tenure);
        }
      }
    }

    this.charts.push({
      title: 'Tenure Lists',
      type: 'PieChart',
      columnNames: ['Business', 'Years'],
      data: this.tenureList,
      length: 1
    });

    const goalArrayName = goalArray.filter((v, i, a) => a.indexOf(v) === i);
    for (let j = 0; j < goalArrayName.length; j++) {
      this.goalList[j] = [goalArrayName[j], 0, this.getRandomColor(), goalArrayName[j]];
      for (const goal of goalArray) {
        if (goalArrayName[j] === goal) {
          this.goalList[j][1] = Number(this.goalList[j][1]) + 1;
        }
      }
    }
    this.charts.push({
      title: 'Business Goals',
      type: 'PieChart',
      columnNames: ['Business', 'Times'],
      roles: [
        { role: 'style', type: 'string', index: 2},
        { role: 'tooltip', type: 'string', index: 3}
      ],
      data: this.goalList,
      options: {
        slices: {
          1: {offset: 0.2},
          3: {offset: 0.3},
          5: {offset: 0.4},
          7: {offset: 0.3},
          9: {offset: 0.1},
          11: {offset: 0.3},
          13: {offset: 0.4},
          15: {offset: 0.3},
          17: {offset: 0.2},
        }
      },
      length: 2
    });
    this.spinner.hide();
    this.getTask();
  }
  getTask() {
    const data  = this.tableData;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.elements = data;
    this.totalSize = this.elements.length;
    this.iterator();
  }
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.elements.slice(start, end);
    this.dataSource = part;
  }
  handlePage(event?: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }
}

