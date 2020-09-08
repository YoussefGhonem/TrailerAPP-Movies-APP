import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NaveComponent } from './nave/nave.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertifyService } from './_services/alertify.service';
import { RegisterComponent } from './Account/register/register.component';
import { LoginComponent } from './Account/login/login.component';
import { RegisterConfirmComponent } from './Account/register-confirm/register-confirm.component';
import { ForgetPasswordComponent } from './Account/forget-password/forget-password.component';
import { PasswordConfirmComponent } from './Account/password-confirm/password-confirm.component';
@NgModule({
  declarations: [
    AppComponent,
    NaveComponent,
    HomeComponent,
    RegisterComponent,
    FooterComponent,
    LoginComponent,
    RegisterConfirmComponent,
    ForgetPasswordComponent,
    PasswordConfirmComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
    
,
  ],
  providers: [
    AuthService,
    AlertifyService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
