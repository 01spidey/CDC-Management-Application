import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private dataService: DataService) {}

  canActivate(route:any, state:any): boolean {
    console.log(this.dataService.user_role);
  
    if (this.dataService.user_role == 'null') {
      this.router.navigate(['']);
      return false;
    }
  
    return true;
  }
}
