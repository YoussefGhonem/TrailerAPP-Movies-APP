import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {

  constructor(private activeRouter:ActivatedRoute,private auth:AuthService,private alertify:AlertifyService) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(parms=>{
      const id=parms['ID'];
      const token=parms['Token'];
      if(id&&token){
        this.auth.EmailConfirm(id,token).subscribe(success=>{
            this.alertify.success("Email Is Confirmed Please LogIn");
        },err=>this.alertify.warning("Sorry This Email Not Confirmed"))
      }
    })
  }

}
