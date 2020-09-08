import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CryptService } from 'src/app/_services/crypt.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService,
    private alertify: AlertifyService, private encService: CryptService) { }
  forgetForm: FormGroup;

  ngOnInit(){
    this.createforgetPasswordForm();
  }


  forgetPassword(){
    var email=this.forgetForm.value.email;
    if(email !== null || email !== ''){
      this.authService.ForgetPassword(email).subscribe(success=>{
        var i=0;
        var exist=false;
        var token= Object.values(success).toString();
        while (localStorage.getItem('token' + i) !== null) {
          i++;
          if (localStorage.getItem('token' + i) === null) {
            localStorage.setItem('token' + i, this.encService.Encrypt(token));
            exist = true;
            break;
          }
        }
        if (!exist) {
          localStorage.setItem('token' + i, this.encService.Encrypt(token));
        }
        this.alertify.success("If the e-mail entered is correct, the activation message has been sent to it")

      },err=>console.log(err))
    }
  }

  createforgetPasswordForm() {
    this.forgetForm = this.fp.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
