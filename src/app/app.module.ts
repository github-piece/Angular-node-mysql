import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './pages/front/home/home.component';
import { HeaderComponent } from './includes/front/header/header.component';
import {_MatMenuDirectivesModule, MatIconModule, MatMenuModule, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FooterComponent } from './includes/front/footer/footer.component';
import { AboutComponent } from './pages/front/about/about.component';
import { ContactComponent } from './pages/front/contact/contact.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import {HttpClientModule} from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent
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
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
