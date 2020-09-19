import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserRoleModel } from 'src/app/_models/EditUserRoleModel';
import { RoleModel } from 'src/app/_models/RoleModel';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.css']
})
export class EditRolesComponent implements OnInit {
  roles: RoleModel[];
  userRole: EditUserRoleModel;
  userForm: FormGroup;
  UserId: string;
  RoleId: string;
  userName: string;
  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private service: AdminService
  ) { }

  ngOnInit(): void {
    this.userRole = {
      roleId: '',
      userId: ''
    };
    this.validation();
    this.RoleControl();
  }
  validation() {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      roleName: ['', [Validators.required]],
    });
  }

  RoleControl() {
    this.activateRoute.paramMap.subscribe(param => {
      var userId = param.get('id');
      var roleId = param.get('id1');

      if (userId && roleId) {
        this.service.GetUser(userId).subscribe(x => {
          this.UserId = x.id;
          this.userName = x.userName;
          this.RoleId = roleId;
          this.AddUserData();
        }, ex => console.log(ex));
        this.service.GelAllRoles().subscribe(s => {
          this.roles = s;
        }, ex => console.log(ex))       
      }else {
        this.router.navigate(['notfound']).then(x => { window.location.reload() });
      }
    })
  }
  AddUserData() {
    this.userForm.setValue({
      userName: this.userName,
      roleName: this.RoleId
    })
  }
  EditRoles() {
    if (this.UserId && this.RoleId && this.userForm.valid) {
      this.userRole.roleId = this.RoleId;
      this.userRole.userId = this.UserId;
      this.service.EditUserRole(this.userRole).subscribe(s => {
        sessionStorage.setItem('editUserRole', "true");
        this.router.navigate(['users']);
      }, ex => console.log(ex));
    }
  }

  onRolesChange() {
    this.RoleId = this.userForm.value.roleName;
    console.log(this.RoleId);
  }
}


