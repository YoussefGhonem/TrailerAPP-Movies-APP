import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserModel } from 'src/app/_models/UserModel';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { EditUserModel } from 'src/app/_models/EditUserModel';
import { Users } from 'src/app/_models/users';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  userModel: UserModel;
  msg: string;
  title: string;
  userData: Users;//1-Edit User
  isBusy: Boolean;
  users: Users[];
  editUserData: EditUserModel;//2-Edit User
  id: string;//Edit User
  isEditMode: Boolean;//Edit User
  constructor(private fp: FormBuilder, private router: Router, private authService: AuthService,
    private alertify: AlertifyService, private adminService: AdminService, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.isBusy = false;
    this.msg = '';
    this.title = 'Add New User';
    this.userData = null;//Edit User
    this.id = '';//Edit User
    
    this.isEditMode = false;//Edit User
    this.createRegisterForm();
    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isBusy = true;
      }
    }, er => console.log(er))
    this.editUserData = {
      id: '',
      userName: '',
      email: '',
      emailConfirmed: false,
      password: '',
      phoneNumber: '',
      country: '',
    }
    this.EditUser();//-Edit User
    this.GetAllUsers();
  }

  EditUser() { //-Edit User
    this.activatedRouter.paramMap.subscribe(param => {
      var id = param.get('id');
      if (id) {
        this.adminService.GetUser(id).subscribe(x => {
          this.userData = x;
          this.title = 'Update User';
          this.isEditMode = true;
          this.AddUserData();
          this.id = id;
        }, ex => console.log(ex));
      }
    })
  }

  AddUserData() { //Edit User
    if (this.userData !== null) {
      this.userForm.setValue({
        userName: this.userData.userName,
        email: this.userData.email,
        password: this.userData.passwordHash,
        passwordConfirm: this.userData.passwordHash,
        emailConfirmed: this.userData.emailConfirmed,
        country: this.userData.country,
        phoneNumber: this.userData.phoneNumber
      });
    }
  }
  createRegisterForm() {
    this.userForm = this.fp.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      emailConfirmed: false,
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }
  createUser() {
    if (this.userForm.valid) {
      if (!this.isEditMode) {
        this.userModel=Object.assign({}, this.userForm.value);
        this.adminService.AddUser(this.userModel).subscribe(s => {
          this.ngOnInit();
          this.alertify.success('User Is Aded')
          this.router.navigate(['users']);
        }, ex => console.log(ex));
      } else {
        this.editUserData.id = this.id;
        // this.editUserData=Object.assign({}, this.userForm.value);
        this.editUserData.email = this.userForm.value.email;
        this.editUserData.emailConfirmed = this.userForm.value.emailConfirmed;
        this.editUserData.password = this.userForm.value.password;
        this.editUserData.country = this.userForm.value.country;
        this.editUserData.phoneNumber = this.userForm.value.phoneNumber;
        this.editUserData.userName = this.userForm.value.userName;

        this.adminService.EditUser(this.editUserData).subscribe(x => {
          this.alertify.success('Updated Is Done');
          this.router.navigate(['users']);
        }, ex => console.log(ex));
      }
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
    if (email != null && email != '' && this.isBusy === false ) {
      this.authService.EmailExits(email).subscribe(x => {
        this.messageValidate.email.matchEmail = 'This email is used';
      }, ex => console.log(ex));
      return true;
    } else if(this.isEditMode ) {
      for (const item of this.users.values()) {
        if (this.isEditMode && item.email === email && item.id !== this.userData.id) {
          this.messageValidate.email.matchEmail = 'This email is used';
        }
      }
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
    } else if(this.isEditMode ) {
      for (const item of this.users.values()) {
        if (this.isEditMode && item.userName === userName  && item.id !== this.userData.id) {
          this.messageValidate.userName.matchuserName = 'This User Name is used';
        }
      }
    }
    return false;
  }

  GetAllUsers() {
    this.adminService.GetAllUsers().subscribe((list) => {
      this.users = list;
    }, ex => console.log(ex));
  }
}
