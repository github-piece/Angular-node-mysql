import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {TopNavbarComponent} from '../../includes/dashboard/top-navbar/top-navbar.component';
import {MatButtonModule, MatToolbarModule} from '@angular/material';

@NgModule({
  declarations: [
    DashboardComponent,
    MaindashboardComponent,
    TopNavbarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatButtonModule
  ],
  exports: [
    TopNavbarComponent
  ]
})
export class DashboardModule { }
