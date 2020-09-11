import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { CryptService } from '../_services/crypt.service';
@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit{

 
  @Input() hasRole: string;
  isVisible = false;
  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService, private serivce: CryptService) { }

  ngOnInit() {
   const role = this.serivce.Decrypt(localStorage.getItem('role'));

   if(role == this.hasRole){
     if(!this.isVisible){
       this.isVisible=true;
       this.viewContainerRef.createEmbeddedView(this.templateRef);
     }else{
       this.isVisible = false;
       this.viewContainerRef.clear();
     }
   }
  }

}
