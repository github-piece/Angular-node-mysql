import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './pages/front/home/home.component';
import { HeaderComponent } from './includes/front/header/header.component';
import {
  _MatMenuDirectivesModule, MatButtonModule, MatCardModule, MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FooterComponent } from './includes/front/footer/footer.component';
import { AboutComponent } from './pages/front/about/about.component';
import { ContactComponent } from './pages/front/contact/contact.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import {HttpClientModule} from '@angular/common/http';
import {GoogleChartsModule} from 'angular-google-charts';
import {AgmCoreModule} from '@agm/core';
import {MatTableModule} from '@angular/material/table';
import {ChartsModule} from 'ng2-charts';
import {NgxSpinnerModule} from 'ngx-spinner';
import { SuccessComponent } from './pages/payfast/success/success.component';
import { CancelComponent } from './pages/payfast/cancel/cancel.component';
import { NotificationComponent } from './pages/payfast/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    SuccessComponent,
    CancelComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MDBBootstrapModule.forRoot(),
    GoogleChartsModule.forRoot('AIzaSyB_O_MOsbttHQ9gAXE1iO7gCa1Vgg-6AYo'),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyA6L4RK2RH8CmfPnyV1VEfjrHj3BP66gmE'}),
    MatTableModule,
    MatPaginatorModule,
    ChartsModule,
    NgxSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
