import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route:any, state:any): boolean {
    // console.log(this.dataService.user_role);
  
    if (sessionStorage.getItem('user_role') == 'null') {
      this.router.navigate(['']);
      return false;
    }
  
    return true;
  }
}
