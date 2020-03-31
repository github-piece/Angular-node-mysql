import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {CatalogueService} from '../../../_services/catalogue/catalogue.service';
import {Server} from '../../../../config/url.service';
import {BuysellService} from '../../../_services/buysell/buysell.service';
import {ChartType, RadialChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PayFast} from '../../../../config/url.service';
import {AppUrl} from '../../../../config/url.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  userData: any = [];
  businessInfo: any;
  mainBusiness = [];
  countryList = [];
  goalList = [];
  scoring = [];
  radarChartData: any = [{
    data: []
  }];

  unSdg = [];
  interactions = [];
  stakeholders: any = [];
  stakeholdersCountry = [];
  stakeholdersButton3 = [];
  stakeholdersButton4 = [];
  stakeholdersConsideration = [];
  stakeholdersMap = [];
  stakeholdersProvince = [];
  stakeholdersDistrict = [];
  stakeholdersMunicipality = [];
  show = false;
  nameSearch = '';
  countrySearch = '';
  goalSearch = '';
  businessMatch = true;
  showBusiness = [];
  p = 1;
  historyList: any;
  amount = [];
  tabNum = 0;
  explainIndex: any = 0;
  explainNumber: any = 0;
  radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  radarChartLabels: Label[] = [];
  radarChartType: ChartType = 'radar';
  constructor(
    private authenticationService: AuthenticationService,
    private catalogueService: CatalogueService,
    private buysellService: BuysellService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getBusinessList();
    this.radarChartLabels = [
      'resource counter', 'opportunity counter', 'venture life cycle', 'liability of age size',
      'organisation', 'entrepreneur', 'environment', 'impact sector'
    ];
  }
  getBusinessList() {
    this.businessInfo = [];
    this.catalogueService.getBusinessList(this.userData.userId, 'read')
      .subscribe(data => {
        this.businessInfo = data;
        this.mainBusiness = this.businessInfo.mainBusiness;
        this.process();
      });
  }
  process() {
    this.getHistory();
    let count = 0;
    this.countryList = this.businessInfo.countryList;
    this.goalList = this.businessInfo.goalList;
    this.buysellService.fundTypes = this.businessInfo.instruments;
    for (const business of this.mainBusiness) {
      this.scoring[count] = [
        {
          data: [
            business['resource counter'], business['opportunity counter'], business['venture life cycle'],
            business['liability of age size'], business.organisation, business.entrepreneur, business.environment, business['impact sector']
          ],
          label: business['business name']
        },
        {
          data: [
            business['resource counter'] / this.businessInfo.business_length,
            business['opportunity counter'] / this.businessInfo.business_length,
            business['venture life cycle'] / this.businessInfo.business_length,
            business['liability of age size'] / this.businessInfo.business_length,
            business.organisation / this.businessInfo.business_length,
            business.entrepreneur / this.businessInfo.business_length,
            business.environment / this.businessInfo.business_length,
            business['impact sector'] / this.businessInfo.business_length
          ],
          label: 'Average Scoring'
        }
      ];
      this.radarChartData[count] = this.scoring[count++] as any[];
      if (business['image for front page'].substring(0, 4) !== 'http') {
        business['image for front page'] = Server + '/business/' + business['image for front page'];
      }
      for (const user of this.businessInfo.businessUser) {
        if (business.u_id === user.u_id) {
          business.businessUser = user.u_name;
        }
      }
    }
    this.catalogueService.getTabData(this.userData.userId, JSON.stringify(this.mainBusiness), 'Sustainability')
      .subscribe(data => {this.setTabData(2, data); });
    this.catalogueService.getTabData(this.userData.userId, JSON.stringify(this.mainBusiness), 'Badges')
      .subscribe(data => {this.setTabData(5, data); });
  }
  setTabData(index, data) {
    if (index === 2) {
      this.unSdg = data.unSdg;
      this.interactions = data.interactions;
      this.stakeholders = data.stakeholders;
      this.stakeholdersCountry = this.stakeholders.country;
      this.stakeholdersButton3 = this.stakeholders.button3;
      this.stakeholdersButton4 = this.stakeholders.button4;
      this.stakeholdersConsideration = this.stakeholders.consideration;
      this.stakeholdersMap = this.stakeholders.maps;
      this.stakeholdersProvince = this.stakeholders.province;
      this.stakeholdersDistrict = this.stakeholders.district;
      this.stakeholdersMunicipality = this.stakeholders.municipality;
      this.show = true;
    } else {
      this.unSdg = data.unSdg;
    }
  }
  businessSearch(businessName, countryName, goalName) {
    this.nameSearch = businessName;
    this.countrySearch = countryName;
    this.goalSearch = goalName;
    const searchBusiness = [];
    let j = 0;
    for (const business of this.mainBusiness) {
      if (this.nameSearch === '' || business['business name'] === this.nameSearch) {
        if (this.countrySearch === '' || business.country.includes(this.countrySearch)) {
          if (this.goalSearch === '' || business['goal name'].includes(this.countrySearch)) {
            searchBusiness[j] = business;
            j++;
          }
        }
      }
    }
    if ( j === 0) {
      this.businessMatch = false;
    }
    this.showBusiness = searchBusiness;
  }
  showAllBusiness() {
    this.nameSearch = '';
    this.countrySearch = '';
    this.goalSearch = '';
    this.showBusiness = this.mainBusiness;
    this.businessMatch = true;
  }
  getHistory() {
    this.historyList = [];
    this.buysellService.getBuyHistory(this.userData.userId)
      .subscribe(data => {
        this.historyList = data;
        let k = 0;
        for (const business of this.mainBusiness) {
          const value = business['how much they\'re raising'];
          for (const history of this.historyList) {
            if (business.business_id === history.business_id) {
              const length = business['how much they\'re raising'].length;
              const symbol = business['how much they\'re raising'].slice(length - 3, length);
              business['how much they\'re raising'] = parseFloat(business['how much they\'re raising']) - history.amount;
              business['how much they\'re raising'] = business['how much they\'re raising'] + symbol;
            }
          }
          const remain = business['how much they\'re raising'].slice(0, business['how much they\'re raising'].length - 3);
          if (remain !== '0') {
            this.showBusiness[k] = business;
            this.amount[k] = value;
            k++;
          }
        }
        this.mainBusiness = [];
        this.mainBusiness = this.showBusiness;
      });
  }
  round(value: any) {
    if (isNaN(value) || value === '') {
      return 'No available data';
    }
    return parseFloat(value).toFixed(2);
  }
  explain_content(i, j) {
    this.explainIndex = i;
    this.explainNumber = j;
  }
  buy(businessId, business) {
    this.buysellService.businessRemain = business['how much they\'re raising'];
    this.buysellService.modalContent = 'Are you going to buy this item?';
    this.buysellService.action = 'buy';
    this.buysellService.businessName = business['business name'];
    this.buysellService.commission = this.businessInfo.commission[0];
    this.buysellService.businessId = business.business_id;
    this.openDialog();
  }
  groupShow(index: number) {
    this.tabNum = index;
  }
  onDelete() {
  }
  openDialog() {
    const dialogRef = this.dialog.open(BuymodalComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getBusinessList();
    });
  }
}
@Component({
  selector: 'app-buy-modal',
  templateUrl: './buymodal.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class BuymodalComponent implements OnInit {
  businessId: any;
  businessRemain: any;
  modalContent: any;
  action: any;
  userId: any;
  userName: string;
  commission: any;
  platformFee: any;
  itemName: any;
  url = PayFast;
  signature: any;
  payFastForm: FormGroup;
  formData: FormData;
  formShow = true;
  curSymbol: any;
  balanceValue: any;
  amountBuy: any;
  maxAmount: number;
  fundTypes = [];
  onShow = true;
  fund: any;
  rate: any;
  frequency: any;
  payData = {};
  constructor(
    private dialogRef: MatDialogRef<BuymodalComponent>,
    private authenticationService: AuthenticationService,
    private buysellService: BuysellService,
    private fb: FormBuilder
  ) {
    this.formData = new FormData();
    this.payFastForm = this.fb.group({
      amount: ['', [
        Validators.required,
        (control: AbstractControl) => Validators.max(this.maxAmount)(control),
        Validators.min(0)]],
      fundType: ['', Validators.required],
      rate: ['', Validators.required],
      frequency: ['', Validators.required],
      agreement: new FormControl('', [(control) => {
        return !control.value ? { required: true } : null;
      }])
    });
  }
  ngOnInit() {
    this.initModal();
  }
  initModal() {
    this.userId = this.authenticationService.currentUserSubject.value.uId;
    this.userName = this.authenticationService.currentUserSubject.value.uName;
    this.modalContent = '';
    this.action = '';
    this.businessId = this.buysellService.businessId;
    this.modalContent = this.buysellService.modalContent;
    this.action = this.buysellService.action;
    this.fundTypes = this.buysellService.fundTypes;
    this.itemName = this.buysellService.businessName;
    this.businessRemain = this.buysellService.businessRemain;
    this.maxAmount = parseFloat(this.businessRemain);
    this.curSymbol = this.getCurrencySymbol(this.businessRemain);
    this.getCommission();
  }
  getCurrencySymbol(str) {
    return str.replace(/[\d\., ]/g, '');
  }
  getCommission() {
    this.commission = this.buysellService.commission;
    this.commission.url_return = AppUrl + '/success';
    this.commission.url_cancel = AppUrl + '/cancel';
    this.commission.url_notify = '';
  }
  getSignature() {
    if (this.payFastForm.invalid) {
      return;
    }
    this.amountBuy = this.payFastForm.get('amount').value;
    this.formData.append('merchant_id', this.commission.mse_merchant_id);
    this.formData.append('merchant_key', this.commission.mse_merchant_key);
    this.formData.append('return_url', this.commission.url_return);
    this.formData.append('cancel_url', this.commission.url_cancel);
    this.formData.append('notify_url', this.commission.url_notify);
    this.platformFee =  this.commission.mse_fee * this.payFastForm.get('amount').value;
    this.fund = this.payFastForm.get('fundType').value;
    this.rate = this.payFastForm.get('rate').value;
    this.frequency = this.payFastForm.get('frequency').value;
    this.balanceValue = parseFloat((parseFloat(this.businessRemain) - parseFloat(this.amountBuy)).toPrecision(3));
    this.formData.append('amount', this.amountBuy);
    this.formData.append('item_name', this.itemName);
    this.formData.append('fund', this.fund);
    this.formData.append('rate', this.rate);
    this.formData.append('frequency', this.frequency);
    this.formData.append('payment_method', this.commission.payment_method);
    this.formData.append('businessId', this.businessId);
    this.formData.append('balance', this.businessRemain);
    this.formData.append('userId', this.userId);
    this.generateSignature(this.formData);
    this.formShow = false;
  }
  generateSignature(formData) {
    // return this.payfast.generateSignature(formData)
    //   .pipe(first()).subscribe((res: any) => {
    //     this.signature = res;
    //   });
  }
  onNoClick() {
    console.log(this.payFastForm);
    this.dialogRef.close(this.payFastForm.controls);
  }
  showPart() {
    this.onShow = !this.onShow;
  }
  hasError = (controlName: string, errorName: string) => {
    return this.payFastForm.controls[controlName].hasError(errorName);
  }
}
