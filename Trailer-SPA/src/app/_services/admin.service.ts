import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../_models/users';
import { UserModel } from '../_models/UserModel';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
baseURL=environment.apiUrl+'admin/';
  constructor(private http:HttpClient) { }
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
  };
  
  GetAllUsers():Observable<Users[]>{
    return this.http.get<Users[]>(this.baseURL+'GetUsers',this.headers).pipe();
  }
  AddUser(model: UserModel){
    return this.http.post<UserModel>(this.baseURL + 'AddUser', model, this.headers);
  }

}
