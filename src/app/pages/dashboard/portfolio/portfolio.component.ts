import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {BusinessService} from '../../../_services/business/business.service';
import {BuysellService} from '../../../_services/buysell/buysell.service';
import {MatTableDataSource, PageEvent} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  public charts: Array<{
    title: string;
    type: string;
    data: Array<Array<string | number | {}>>;
    roles?: Array<{ type: string; role: string; index?: number }>;
    columnNames?: Array<string>;
    options?: {};
    length: number;
  }> = [];
  userData: any = [];
  businessData = [];
  historySellList: any = [];
  historyBuyList: any = [];
  historyList: any = [];
  myBusiness = [];
  buyBusiness = [];
  businessList = [['treeMap', null, 0, 0]];
  tenureList = [];
  goalList = [];
  tableData = [];
  dataSource: any;
  contractBuySource: any;
  contractSellSource: any;
  tasks: any[];
  details: any[];
  sell: any[];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  detailsSize = 0;
  sellSize = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private authenticationService: AuthenticationService,
    private businessService: BusinessService,
    private buysellService: BuysellService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getBusinessList(this.userData.userId);
    this.getSellHistory();
    this.getBuyHistory();
  }
  getBusinessList(userId) {
    this.businessService.getBusinessList(userId).subscribe(data => { this.businessData = data; });
  }
  getSellHistory() {
    this.buysellService.getSellHistory(this.userData.userId)
      .subscribe(data => {
        this.historySellList = data;
        for (const history of this.historySellList) {
          const date = new Date(history.date_created);
          history.nextDate = new Date(date.setFullYear(date.getFullYear() + 1)).toString();
        }
      });
  }
  getBuyHistory() {
    this.buysellService.getBuyHistory(this.userData.userId)
      .subscribe(data => {
        this.historyBuyList = data;
        for (const history of this.historyBuyList) {
          for (const business of this.businessData) {
            if (business.business_id === history.business_id) {
              history.businessName = business.name;
            }
          }
        }
        const businessId = [];
        for (const history of this.historyBuyList) {
          const date = new Date(history.date_created);
          history.nextDate = new Date(date.setFullYear(date.getFullYear() + 1)).toString();
        }
        this.historyList = this.historyBuyList.concat(this.historySellList);
        for (let i = 0; i < this.historyList.length; i++) {
          businessId[i] = this.historyList[i].business_id;
        }
        const businessIds = businessId.filter((v, i, a) => a.indexOf(v) === i);
        let count = 0; let index = 0;
        for (const business of this.businessData) {
          if (business.u_id === this.userData.u_id) {
            this.myBusiness[index] = business;
            index++;
          }
          for (const id of businessIds) {
            if (business.business_id === id) {
              this.buyBusiness[count] = business;
              count++;
            }
          }
        }
        this.businessData = [];
        this.businessData = this.buyBusiness;
        let businessArray = [];
        for (const business of this.businessData) {
          const businessValue = business.business.split(',');
          businessArray = businessArray.concat(businessValue);
        }
        const businessArrayName = businessArray.filter((v, i, a) => a.indexOf(v) === i);
        for (let j = 0; j < businessArrayName.length; j++) {
          this.businessList[j + 1] = [businessArrayName[j], 'treeMap', 0, businessArrayName.length - j - 1];
          for (const array of businessArray) {
            if (businessArrayName[j] === array) {
              this.businessList[j + 1][2] = Number(this.businessList[j + 1][2]) + 1;
            }
          }
        }
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
        this.getTasks();
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
          for (const array of goalArray) {
            if (goalArrayName[j] === array) {
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
      });
  }
  getTasks() {
    const data = this.tableData;
    const buyContracts = this.historyBuyList;
    const sellContracts = this.historySellList;
    this.dataSource = new MatTableDataSource<any>(data);
    this.contractBuySource = new MatTableDataSource<any>(buyContracts);
    this.contractSellSource = new MatTableDataSource<any>(sellContracts);
    this.dataSource.paginator = this.paginator;
    this.contractBuySource.paginator = this.paginator;
    this.contractSellSource.paginator = this.paginator;
    this.tasks = data;
    this.details = buyContracts;
    this.sell = sellContracts;
    this.totalSize = this.tasks.length;
    this.detailsSize = this.details.length;
    this.sellSize = this.sell.length;
    this.iterator();
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.tasks.slice(start, end);
    const detailPart = this.details.slice(start, end);
    const sellPart = this.sell.slice(start, end);
    this.dataSource = part;
    this.contractBuySource = detailPart;
    this.contractSellSource = sellPart;
    this.spinner.hide();
  }
  handlePage(event?: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
