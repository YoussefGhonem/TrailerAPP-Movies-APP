import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../_models/users';
import { UserModel } from '../_models/UserModel';
import { EditUserModel } from '../_models/EditUserModel';
import { UserRoleModel } from '../_models/UserRoleModel';
import { RoleModel } from '../_models/RoleModel';
import { EditUserRoleModel } from '../_models/EditUserRoleModel';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseURL = environment.apiUrl + 'admin/';
  constructor(private http: HttpClient) { }
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
  };

  GetAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.baseURL + 'GetUsers', this.headers).pipe();
  }
  AddUser(model: UserModel) {
    return this.http.post<UserModel>(this.baseURL + 'AddUser', model, this.headers);
  }
  EditUser(model: EditUserModel): Observable<Users> {
    return this.http.put<Users>(this.baseURL + 'EditUser', model, this.headers).pipe();
  }

  GetUser(id: string): Observable<Users> {
    return this.http.get<Users>(this.baseURL + 'GetUser/' + id, this.headers).pipe();
  }
  DeleteAll(ids: string[]) {
    return this.http.post(this.baseURL + 'DeleteUsers', ids, this.headers).pipe();
  }
  GetUserRoles(): Observable<UserRoleModel[]> {
    return this.http.get<UserRoleModel[]>(this.baseURL + 'GetUserRoles', this.headers).pipe();
  }
  GelAllRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.baseURL + 'GetAllRoles', this.headers).pipe();
  }
  EditUserRole(model: EditUserRoleModel): Observable<EditUserRoleModel> {
    return this.http.put<EditUserRoleModel>(this.baseURL + 'EditUserRole', model, this.headers).pipe();
  }
}
