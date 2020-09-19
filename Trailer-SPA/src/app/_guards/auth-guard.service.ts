import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(   private service: AuthService,
    private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const email=!!localStorage.getItem('email');
    const role=!!localStorage.getItem('role');
    var roleName=this.service.role;
    if(role){
      if(roleName.toLowerCase()!='admin'){
        this.router.navigate(['accessdenied']).then(x => { window.location.reload() });
      }
      return true;
    }
    else {
      if (!email || !role) {
        this.router.navigate(['notfound']).then(x => { window.location.reload() });
      }
    }
    return false;
  }
}
