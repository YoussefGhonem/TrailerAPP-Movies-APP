import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nave',
  templateUrl: './nave.component.html',
  styleUrls: ['./nave.component.css']
})
export class NaveComponent implements OnInit {

  constructor(private router: Router,private authService:AuthService,
    private alertify:AlertifyService) { }

    ngOnInit() {
      if (this.isUserRegistered()) {
        if (this.authService.IsExpiredDate(this.authService.expire) === true) {
          this.logout();
        }
        this.authService.CheckUserClaims(this.authService.email, this.authService.role).subscribe(success => {
          console.log('user is authorized');
        }, err => {
          console.log(err);
          this.logout();
        });
      }
    }
  logout(){
    this.authService.logOut().subscribe(
      succ=>{
        localStorage.clear();
        this.alertify.success("LogOut");
        this.router.navigate(['home']);
      },
      err=>{
        this.alertify.error(err);
      }
    )
  }

  isUserRegistered(){

    const storage=!!localStorage.getItem('email');
    if(storage){
      return true;
    }
    return false;
  }
}
