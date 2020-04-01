import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {TopNavbarComponent} from '../../includes/dashboard/top-navbar/top-navbar.component';
import {
  _MatMenuDirectivesModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  MatCheckboxModule, MatSlideToggleModule, MatProgressBarModule, MatRadioModule
} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import {InvestComponent, InvestDetailComponent} from './invest/invest.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { UserpageComponent } from './userpage/userpage.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { TermPolicyComponent } from './term-policy/term-policy.component';
import { ContactusComponent } from './contactus/contactus.component';
import {AgmCoreModule} from '@agm/core';
import {GoogleChartsModule} from 'angular-google-charts';
import {MatTableModule} from '@angular/material/table';
import {NgxPaginationModule} from 'ngx-pagination';
import {ChartsModule} from 'ng2-charts';
import {BuymodalComponent} from './catalogue/catalogue.component';
import {UserCreateModalComponent} from './userpage/usercreate.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {NgxSpinnerModule} from 'ngx-spinner';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MaindashboardComponent,
    TopNavbarComponent,
    NewsfeedComponent,
    InvestComponent,
    PortfolioComponent,
    CatalogueComponent,
    UserpageComponent,
    FaqsComponent,
    AboutusComponent,
    TermPolicyComponent,
    ContactusComponent,
    InvestDetailComponent,
    BuymodalComponent,
    UserCreateModalComponent,
    OverviewComponent
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
    MatListModule,
    MatSelectModule,
    AgmCoreModule,
    GoogleChartsModule,
    MatTableModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    ChartsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ImageCropperModule,
    NgxSpinnerModule,
    MatProgressBarModule,
    MatRadioModule
  ],
  exports: [
    TopNavbarComponent,
  ],
  entryComponents: [
    InvestDetailComponent,
    BuymodalComponent,
    UserCreateModalComponent
  ]
})
export class DashboardModule { }
