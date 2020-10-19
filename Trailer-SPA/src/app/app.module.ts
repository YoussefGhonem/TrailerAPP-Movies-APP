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
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { UsersComponent } from './Admin/users/users.component';
import { AddUserComponent } from './Admin/add-user/add-user.component';
import { UserRolesComponent } from './Admin/user-roles/user-roles.component';
import { AuthGuardService } from './_guards/auth-guard.service';
import { AccessDeniedComponent } from './Auth-Guard/access-denied/access-denied.component';
import { NotFoundComponent } from './Auth-Guard/not-found/not-found.component';
import { EditRolesComponent } from './Admin/edit-roles/edit-roles.component';
import { CategoriesListComponent } from './Admin/Manage-Categories/categories-list/categories-list.component';
import { CategoriesAddComponent } from './Admin/Manage-Categories/categories-add/categories-add.component';
import { CategoryEditComponent } from './Admin/Manage-Categories/category-edit/category-edit.component';
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
    PasswordConfirmComponent,
    DashboardComponent,
    HasRoleDirective,
    UsersComponent,
    AddUserComponent,
    UserRolesComponent,
    AccessDeniedComponent,
    NotFoundComponent,
    EditRolesComponent,
    CategoriesListComponent,
    CategoriesAddComponent,
    CategoryEditComponent
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
    AlertifyService,
    AuthGuardService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
