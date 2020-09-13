import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
// import { AuthService } from 'src/app/_services/auth.service';
// import{User} from'src/app/_models/user';
// import { AlertifyService } from 'src/app/_services/alertify.service';
// declare let alertify:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService,
    private alertify: AlertifyService) { }
  user: User;
  registerForm: FormGroup;
  regex: RegExp;
  isBusy: Boolean;


  ngOnInit() {

    this.createRegisterForm();
    this.isBusy = false;
    this.registerForm.valueChanges.subscribe(x => {
      if (this.registerForm.status == 'VALID') {
        this.isBusy = true;
      }
    }, er => console.log(er))


  }
  createRegisterForm() {
    this.registerForm = this.fp.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(4)]]
    });
  }


  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      //  this.validateRegisterModel();
      this.authService.Register(this.user).subscribe(
        () => {
          this.alertify.success('Regester Is Done Please Confirm from Your Email')
          this.registerForm.reset();
          this.ngOnInit();
        }, error => { console.log(error); }
      );
    }

  }


  isPasswordMatch() {
    if (this.registerForm.value.password !== '' && this.registerForm.value.passwordConfirm !== '') {
      if ((this.registerForm.value.password !== this.registerForm.value.passwordConfirm) &&
        this.registerForm.value.password.length > 5 && this.registerForm.value.passwordConfirm.length > 5) {
        return true;
      }
    }
    return false;
  }
  messageValidate = {
    pass: {
      notMatch: ''
    },
    email: {
      matchEmail: ''
    },
    userName: {
      matchuserName: ''
    }
  }

  isPasswordValid() {
    const pass = this.registerForm.value.password;
    if (pass !== '' && pass.length > 5) {
      this.regex = new RegExp('[a-z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'Password must contain a lowercase letter';
        return false;
      }
      this.regex = new RegExp('[A-Z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'Password must contain at least an uppercase letter';
        return false;
      }
      this.regex = new RegExp('[~!@#$%^&*()+<>{}]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'Password must contain at least a distinguished character';
        return false;
      }
      this.regex = new RegExp('[0-9]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'Password must contain at least one number';
        return false;
      }
    }
    return true;
  }


  isEmailExist() {
    const email = this.registerForm.value.email;
    if (email != null && email != '' && this.isBusy ===false) {
      this.authService.EmailExits(email).subscribe(x => {
        this.messageValidate.email.matchEmail = 'This email is used';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.email.matchEmail = null;
    }
    return false;
  }

  isUserNameExist() {
    const userName = this.registerForm.value.userName;
    if (userName != null && userName != '' && this.isBusy === false) {
      this.authService.userNameExits(userName).subscribe(x => {
        this.messageValidate.userName.matchuserName = 'This User Name is used';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.userName.matchuserName = null;
    }
    return false;
  }
}




