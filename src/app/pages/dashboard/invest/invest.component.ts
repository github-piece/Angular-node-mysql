import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
export interface DialogData {
  index: number;
}
@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {
  investList = [];
  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
    this.investList = investList;
  }
  viewDetail(i) {
    this.matDialog.open(InvestDetailComponent, {
      width: '40%',
      minWidth: '320px',
      data: {index: i}
    });
  }
}
@Component({
  selector: 'app-invest-detail',
  template: '<div>' +
  '<img [src]="detailData[data.index].image" alt="Invest Image" class="w-100">' +
  '<div class="mat-card-header mt-2">{{detailData[data.index].title}}</div>' +
  '<mat-card-content>' +
    '<p>{{detailData[data.index].text}}</p>' +
    '<p>{{detailData[data.index].subtext}}</p>' +
    '<p>{{detailData[data.index].product}}</p>' +
  '</mat-card-content>' +
  '</div>',
  styleUrls: ['./invest.component.css']
})
export class InvestDetailComponent implements OnInit {
  detailData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  ngOnInit() {
    this.detailData = investList;
  }
}
export const investList = [
  {
    image: 'assets/lists/list1.jpg',
    title: 'MAKE YOUR PRODUCTS SHINE!',
    text: 'As the temperature drops and the wind chill increases,' +
      ' limit the amount time you spend outdoors. If you must be out in the cold.',
    subtext: 'You don’t want your skin exposed',
    product: 'black-mamba'
  },
  {
    image: 'assets/lists/list2.jpeg',
    title: 'SELECT THE CORRECT SHOES',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting' +
      ' industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    subtext: 'Where can I get some?',
    product: 'airperez'
  },
  {
    image: 'assets/lists/list3.jpeg',
    title: 'AND ALWAYS REMEMBER TO HAVE FUN!',
    text: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' +
      ' It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
    subtext: 'Where does it come from?',
    product: 'spacex'
  },
  {
    image: 'assets/lists/list4.jpeg',
    title: 'AND ALWAYS REMEMBER TO HAVE FUN!',
    text: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' +
      ' It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
    subtext: 'Where does it come from?',
    product: 'spacex'
  }
];
