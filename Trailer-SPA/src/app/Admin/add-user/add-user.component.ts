import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserModel } from 'src/app/_models/UserModel';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm:FormGroup;
  userModel:UserModel;
  msg:string;
  isBusy: Boolean;
  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService,
    private alertify: AlertifyService,private adminService:AdminService) { }

  ngOnInit(): void {
    this.isBusy = false;
    this.msg='';
    this.createRegisterForm();
    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isBusy = true;
      }
    }, er => console.log(er))
  }

  createRegisterForm() {
    this.userForm = this.fp.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      emailConfirmed: false,
      country: ['', Validators.required],
      phoneNumber:  ['', Validators.required]
    });
  }
  createUser(){
    if (this.userForm.valid) {
      this.userModel = Object.assign({}, this.userForm.value);
      this.adminService.AddUser(this.userModel).subscribe(
        () => {
          this.alertify.success('User Is Added ')
          this.userForm.reset();
          this.ngOnInit();
        }, error => { console.log(error); }
      );
    }
   
  }
  isPasswordMatch() {
    if (this.userForm.value.password !== '' && this.userForm.value.passwordConfirm !== '') {
      if ((this.userForm.value.password !== this.userForm.value.passwordConfirm) &&
        this.userForm.value.password.length > 5 && this.userForm.value.passwordConfirm.length > 5) {
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
  
  isEmailExist() {
    const email = this.userForm.value.email;
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
    const userName = this.userForm.value.userName;
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
