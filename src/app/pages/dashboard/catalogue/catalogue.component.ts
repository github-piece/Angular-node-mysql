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
import {NgxSpinnerService} from 'ngx-spinner';
import {PayfastService} from '../../../_services/payfast/payfast.service';

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
  scoutUnSdg = {};
  nameSearch = '';
  countrySearch = '';
  goalSearch = '';
  businessMatch = true;
  showBusiness = [];
  p = 1;
  historyList: any;
  amount = [];
  tabNum = [];
  explainIndex: any = 0;
  explainNumber: any = 'SDG 1';
  getCompare = [];
  compareData = {};
  onCompareData = [];
  radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  radarChartLabels: Label[] = [];
  radarChartType: ChartType = 'radar';
  constructor(
    private authenticationService: AuthenticationService,
    public catalogueService: CatalogueService,
    private buysellService: BuysellService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
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
        this.spinner.hide();
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
      for (let i = 0; i < this.businessInfo.businessUser; i++) {
        if (business.u_id === this.businessInfo.businessUser[i]) {
          business.businessUser = this.businessInfo.businessUser[i].u_name;
        }
      }
    }
  }
  setTabData(data) {
    this.interactions = data.interactions;
    this.stakeholders = data.stakeholders;
    this.unSdg = data.unSdg;
  }
  setScoutTabData(data, i) {
      this.spinner.hide();
      this.scoutUnSdg[i] = data.unSdg;
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
    this.setFlag(this.showBusiness.length);
    this.getStake(this.showBusiness);

  }
  getStake(business) {
    this.catalogueService.getTabData(this.userData.userId, JSON.stringify(business), 'Sustainability')
      .subscribe(data => {this.setTabData(data); });
  }
  showAllBusiness() {
    this.nameSearch = '';
    this.countrySearch = '';
    this.goalSearch = '';
    this.showBusiness = this.mainBusiness;
    this.getStake(this.showBusiness);
    this.setFlag(this.showBusiness.length);
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
        this.getStake(this.showBusiness);
        this.setFlag(this.showBusiness.length);
        this.mainBusiness = [];
        this.mainBusiness = this.showBusiness;
      });
  }
  setFlag(length) {
    this.getCompare = [];
    for (let i = 0; i < length; i++) {
      this.getCompare[i] = true;
      this.tabNum[i] = 0;
      this.onCompareData[i] = false;
    }
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
  groupShow(index: number, i) {
    this.tabNum[i] = index;
  }
  getCompareData(businessId, index) {
    if (this.getCompare[index]) {
      this.getCompare[index] = false;
      this.onCompareData[index] = false;
      this.compareData[index] = {};
      this.scoutUnSdg[index] = [];
      this.spinner.show();
      this.catalogueService.getCompareData(businessId).subscribe(result => {
        if (result !== null) {
          this.onCompareData[index] = true;
          this.compareData[index] = result;
          const compareDataList = [this.compareData[index]];
          this.catalogueService.getTabData(this.userData.userId, JSON.stringify(compareDataList), 'Sustainability').subscribe(data => {
              this.setScoutTabData(data, index);
          });
        } else {
          this.spinner.hide();
        }
      });
    }
  }
  onDelete() {
  }
  openDialog() {
    this.dialog.open(BuymodalComponent, {
      width: '600px'
    });
  }
  sell(id: any) {
  }
}
@Component({
  selector: 'app-buy-modal',
  templateUrl: './buymodal.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class BuymodalComponent implements OnInit {
  userData: any;
  businessId: any;
  businessRemain: any;
  modalContent: any;
  action: any;
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
  rates = ['0%~2%', '2%~5%', '5%~10%', '10%~15%', '15%~20%', '20%~30%', '0%~2%'];
  frequencies = ['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Bi-Annually'];
  constructor(
    private dialogRef: MatDialogRef<BuymodalComponent>,
    private authenticationService: AuthenticationService,
    private buysellService: BuysellService,
    private fb: FormBuilder,
    private payfastService: PayfastService
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
    this.userData = this.authenticationService.currentUserSubject.value;
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
    this.platformFee = this.commission.mse_fee * this.payFastForm.get('amount').value;
    this.balanceValue = parseFloat((parseFloat(this.businessRemain) - parseFloat(this.amountBuy)).toPrecision(3));
    this.formData.append('amount', this.amountBuy);
    this.formData.append('item_name', this.itemName);
    this.formData.append('custom_str1', this.payFastForm.get('fundType').value);
    this.formData.append('custom_str2', this.payFastForm.get('rate').value);
    this.formData.append('custom_str3', this.payFastForm.get('frequency').value);
    this.formData.append('custom_str4', this.businessId);
    this.formData.append('custom_str5', this.userData.userId);
    this.formData.append('payment_method', this.commission.payment_method);
    this.generateSignature(this.formData);
  }
  generateSignature(formData) {
    this.payfastService.generateSignature(formData).subscribe(result => {
      this.signature = result.signature;
      this.formShow = false;
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  showPart() {
    this.onShow = !this.onShow;
  }
  onCheckOut() {
    const payData = {
      curSymbol: this.curSymbol
    };
    this.formData.forEach((value, key) => {
      payData[key] = value;
    });
    localStorage.setItem('payData', JSON.stringify(payData));
  }
  hasError = (controlName: string, errorName: string) => {
    return this.payFastForm.controls[controlName].hasError(errorName);
  }
}
