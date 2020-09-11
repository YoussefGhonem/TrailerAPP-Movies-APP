import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { User } from 'src/app/_models/user';
import { Users } from 'src/app/_models/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private service:AdminService) { }
users:Users[];
  ngOnInit(): void {
    this.users=null;
    this.GetAllUsers();
  }
  GetAllUsers(){
    this.service.GetAllUsers().subscribe((list)=>{
      this.users=list;
    },er=>{console.log(er)})
  }

}
