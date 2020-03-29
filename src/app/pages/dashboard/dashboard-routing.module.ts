import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {NewsfeedComponent} from './newsfeed/newsfeed.component';
import {InvestComponent} from './invest/invest.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {CatalogueComponent} from './catalogue/catalogue.component';
import {UserpageComponent} from './userpage/userpage.component';
import {FaqsComponent} from './faqs/faqs.component';
import {AboutusComponent} from './aboutus/aboutus.component';
import {TermPolicyComponent} from './term-policy/term-policy.component';
import {ContactusComponent} from './contactus/contactus.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'maindashboard', pathMatch: 'full'},
      {path: 'maindashboard', component: MaindashboardComponent},
      {path: 'newsfeed', component: NewsfeedComponent},
      {path: 'howtopage', component: InvestComponent},
      {path: 'portfolio', component: PortfolioComponent},
      {path: 'catalogue', component: CatalogueComponent},
      {path: 'userpage', component: UserpageComponent},
      {path: 'faqs', component: FaqsComponent},
      {path: 'about', component: AboutusComponent},
      {path: 'terms', component: TermPolicyComponent},
      {path: 'contact', component: ContactusComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
