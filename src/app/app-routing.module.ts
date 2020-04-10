import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/front/home/home.component';
import {AboutComponent} from './pages/front/about/about.component';
import {ContactComponent} from './pages/front/contact/contact.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {SignupComponent} from './pages/auth/signup/signup.component';
import {SuccessComponent} from './pages/payfast/success/success.component';
import {CancelComponent} from './pages/payfast/cancel/cancel.component';
import {NotificationComponent} from './pages/payfast/notification/notification.component';
import {takeUntil} from 'rxjs/operators';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {path: 'success', component: SuccessComponent},
  {path: 'cancel', component: CancelComponent},
  {path: 'notification', component: NotificationComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
