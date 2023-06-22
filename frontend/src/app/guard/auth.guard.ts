
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route:any, state:any): boolean {
    // console.log(this.dataService.user_role);
  
    if(sessionStorage.getItem('user_id')=='null'){
      this.router.navigate([''])
      return false
    }
  
    return true;
  }
}

