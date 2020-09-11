import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
isUsersList:boolean;
  ngOnInit(): void {
    this.isUsersList=false;
  }
  ShowUsers():boolean{
    return this.isUsersList=true;
  }
}
