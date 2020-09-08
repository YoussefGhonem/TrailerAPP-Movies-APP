import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserLogin } from 'src/app/_models/User-Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService, private alertify: AlertifyService) { }
  loginForm: FormGroup;
  userLogin: UserLogin;
  msg: string;
  ngOnInit(): void {
    this.createloginForm();
    this.msg = '';
  }

  createloginForm() {
    this.loginForm = this.fp.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: false
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.userLogin = Object.assign({}, this.loginForm.value);
      this.authService.login(this.userLogin).subscribe(
        success => {
          const rem = !!this.loginForm.value.rememberMe;
          const email = this.loginForm.value.email;
          this.authService.installStorage(rem, email);
          this.alertify.success("Login Success");
          this.router.navigate['home'];
        },
        err => {
          console.error(err);
          this.msg = err.error;
        }

      )
    }

  }
}
