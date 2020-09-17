import { Component, OnInit } from '@angular/core';
import { UserRoleModel } from 'src/app/_models/UserRoleModel';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  userRoles: UserRoleModel[];
  constructor(private adminServices: AdminService) { }

  ngOnInit(): void {
    this.userRoles = [];
    this.GetUserRoles();
  }

  GetUserRoles() {
    this.adminServices.GetUserRoles().subscribe(s => {
      this.userRoles = s;
      console.log(this.userRoles);
    }, ex => console.log(ex));
  }

}
