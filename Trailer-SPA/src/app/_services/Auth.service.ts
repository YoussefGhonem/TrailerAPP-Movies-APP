import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { UserLogin } from '../_models/User-Login';
import { CryptService } from './crypt.service';
import { ResetPassword } from '../_models/resetpassword';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email: string;
  expire: string;
  role: string;

  baseUrl = environment.apiUrl + 'account/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
  };


  constructor(private http: HttpClient, private serivce: CryptService) {
    // Encryption
    if (this.isUserRegistered()) {
      this.expire = this.serivce.Decrypt(localStorage.getItem('expire'));
      this.email = this.serivce.Decrypt(localStorage.getItem('email'));
      this.role = this.serivce.Decrypt(localStorage.getItem('role'));
    }
  }
  
  installStorage(rem: boolean, email: string) {
    const day = new Date();
    if (rem) {
      day.setDate(day.getDate() + 10);
    } else {
      day.setMinutes(day.getMinutes() + 30);
    }

    localStorage.setItem('email', this.serivce.Encrypt(email));
    localStorage.setItem('expire', this.serivce.Encrypt(day.toString()));

    this.GetRoleName(email).subscribe(success => {
      localStorage.setItem('role', this.serivce.Encrypt(success));
    }, e => console.log(e));
  }

  IsExpiredDate(day: string) {
    const dateNow = new Date();
    const dateExpire = new Date(Date.parse(day));
    if (dateExpire < dateNow) {
      return true;
    }
    return false;
  }

  isUserRegistered() {
    const email = !!localStorage.getItem('email');
    const exp = !!localStorage.getItem('expire');
    const role = !!localStorage.getItem('role');

    if (email && role && exp) {
      return true;
    }
    return false;
  }


  GetRoleName(email: string) {
    return this.http.get('http://localhost:5000/Account/GetRoleName/' + email, { responseType: 'text' }).pipe();
  }


  CheckUserClaims(email: string, role: string) {
    return this.http.get('http://localhost:5000/Account/CheckUserClaims/' + email + '/' + role,
      { withCredentials: true }).pipe();
  }
  ////////////////////////////////////////////////
  Register(reg: User) {
    return this.http.post<User>(this.baseUrl + 'register', reg, this.headers);
  }

  login(login: UserLogin) {
    return this.http.post<User>(this.baseUrl + 'login', login, this.headers);
  }
  logOut() {
    return this.http.get(this.baseUrl + 'logout', { withCredentials: true });
  }

  EmailConfirm(id: string, token: string) {
    return this.http.get(this.baseUrl + 'RegistrationConfirm?ID=' + id + '&Token=' + token);
  }

  userNameExits(username: string) {
    return this.http.get(this.baseUrl + 'usernameexits?username=' + username);
  }

  EmailExits(email: string) {
    return this.http.get(this.baseUrl + 'emailexits?email=' + email);
  }
  ForgetPassword(email: string) {
    return this.http.get(this.baseUrl + 'ForgetPassword/' + email).pipe();
  }
  ResetPassword(reset: ResetPassword) : Observable<ResetPassword>{
    return this.http.post<ResetPassword>(this.baseUrl + 'ResetPassword', reset, this.headers).pipe();
  }
}
