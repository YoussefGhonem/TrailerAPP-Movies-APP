import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './Account/register/register.component';
import { RegisterConfirmComponent } from './Account/register-confirm/register-confirm.component';
import { ForgetPasswordComponent } from './Account/forget-password/forget-password.component';
import { PasswordConfirmComponent } from './Account/password-confirm/password-confirm.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { AddUserComponent } from './Admin/add-user/add-user.component';
import { UserRolesComponent } from './Admin/user-roles/user-roles.component';
import { AccessDeniedComponent } from './Auth-Guard/access-denied/access-denied.component';
import { NotFoundComponent } from './Auth-Guard/not-found/not-found.component';
import { AuthGuardService } from './_guards/auth-guard.service';
import { EditRolesComponent } from './Admin/edit-roles/edit-roles.component';
import { CategoriesListComponent } from './Admin/Manage-Categories/categories-list/categories-list.component';
import { Category } from './_models/CategoryModel';
import { CategoriesAddComponent } from './Admin/Manage-Categories/categories-add/categories-add.component';
import { CategoryEditComponent } from './Admin/Manage-Categories/category-edit/category-edit.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'registerconfirm',component:RegisterConfirmComponent},
  {path:'forgetpassword',component:ForgetPasswordComponent},
  {path:'passwordconfirm',component:PasswordConfirmComponent},
  {path:'admindashboard',component:DashboardComponent,canActivate:[AuthGuardService]},
  {path:'users',component:UsersComponent,canActivate:[AuthGuardService]},
  {path:'adduser',component:AddUserComponent,canActivate:[AuthGuardService]},
  {path:'edituser/:id',component:AddUserComponent,canActivate:[AuthGuardService]},
  {path:'roles',component:UserRolesComponent,canActivate:[AuthGuardService]},
  {path:'accessdenied',component:AccessDeniedComponent},
  {path:'notfound',component:NotFoundComponent},
  {path:'edituserrole/:id/:id1',component:EditRolesComponent},
  {path:'categorylist',component:CategoriesListComponent},
  {path:'addcategory',component:CategoriesAddComponent},
  {path:'editcategory/:id',component:CategoryEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
