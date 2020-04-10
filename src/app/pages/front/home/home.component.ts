import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  onShow: any;

  constructor() { }

  ngOnInit() {
    this.onShow = localStorage.getItem('siteShow');
  }
  match() {
    const value = document.getElementById('password')['value'];
    if (value === 'mseangularsite') {
      this.onShow = 'ok';
      localStorage.setItem('siteShow', this.onShow);
    }
  }
}
