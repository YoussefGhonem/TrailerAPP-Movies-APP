import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './Account/register/register.component';
import { RegisterConfirmComponent } from './Account/register-confirm/register-confirm.component';
import { ForgetPasswordComponent } from './Account/forget-password/forget-password.component';
import { PasswordConfirmComponent } from './Account/password-confirm/password-confirm.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'registerconfirm',component:RegisterConfirmComponent},
  {path:'forgetpassword',component:ForgetPasswordComponent},
  {path:'passwordconfirm',component:PasswordConfirmComponent},
  {path:'admindashboard',component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
