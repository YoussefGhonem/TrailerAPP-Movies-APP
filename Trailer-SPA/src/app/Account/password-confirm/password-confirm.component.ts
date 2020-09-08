import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ResetPassword } from 'src/app/_models/resetpassword';
import { CryptService } from 'src/app/_services/crypt.service';

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.css']
})
export class PasswordConfirmComponent implements OnInit {
  passModel: ResetPassword;
  passConfirmForm: FormGroup;
  regex: RegExp;
  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService,
    private alertify: AlertifyService, private activeRoute: ActivatedRoute,
    private encService: CryptService) { }

  ngOnInit() {
    this.passModel = {
      Id: '',
      Token: '',
      Password: ''
    };
    this.ResetPassword();
    this.createpassConfirm();
  }

  ResetPassword() {
    this.activeRoute.queryParams.subscribe(param => {
      var exist = false;
      this.passModel.Id = param['ID'];
      this.passModel.Token = param['Token'];
      if (this.passModel.Id && this.passModel.Token) {
        var keys = Object.keys(localStorage);
        keys.forEach(element => {
          if (element !== null && element.includes('token')) {
            var item = localStorage.getItem(element);
            if (item !== null) {
              var token = this.encService.Decrypt(item);
              if (token === this.passModel.Token) {
                exist = true;
                return;
              }
            }
          }
        });
        if (!exist) {
          this.router.navigate(['home']).then(x => { window.location.reload(); })
        }
      } else {
        this.router.navigate(['home']).then(x => { window.location.reload(); })
      }
    }, ex => console.log(ex));

  }

  createpassConfirm() {
    this.passConfirmForm = this.fp.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  passConfirm() {
    if (this.passConfirmForm.value.password !== null) {
      this.passModel.Password = this.passConfirmForm.value.password;
      this.authService.ResetPassword(this.passModel).subscribe(x => {
        this.alertify.success('success');
        this.router.navigate(['']);
      }, ex => console.log(ex))
    }
  }

  isPasswordMatch() {
    if (this.passConfirmForm.value.password !== '' && this.passConfirmForm.value.passwordConfirm !== '') {
      if ((this.passConfirmForm.value.password !== this.passConfirmForm.value.passwordConfirm) &&
        this.passConfirmForm.value.password.length > 5 && this.passConfirmForm.value.passwordConfirm.length > 5) {
        return true;
      }
    }
    return false;
  }
}
