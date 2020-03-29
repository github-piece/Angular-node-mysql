import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {TopNavbarComponent} from '../../includes/dashboard/top-navbar/top-navbar.component';
import {MenuComponent} from '../../includes/dashboard/menu/menu.component';
import {
  _MatMenuDirectivesModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule, MatListModule, MatMenuModule, MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { InvestComponent } from './invest/invest.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { UserpageComponent } from './userpage/userpage.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { TermPolicyComponent } from './term-policy/term-policy.component';
import { ContactusComponent } from './contactus/contactus.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MaindashboardComponent,
    TopNavbarComponent,
    MenuComponent,
    NewsfeedComponent,
    InvestComponent,
    PortfolioComponent,
    CatalogueComponent,
    UserpageComponent,
    FaqsComponent,
    AboutusComponent,
    TermPolicyComponent,
    ContactusComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatCardModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    TopNavbarComponent,
    MenuComponent
  ]
})
export class DashboardModule { }
