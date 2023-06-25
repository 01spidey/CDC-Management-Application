import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class HomeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('login guard');
    const curPage = sessionStorage.getItem('cur_page');

    if (curPage === 'login') {
      this.router.navigate(['login']);
      return false;
    } else if (curPage === 'officer') {
      this.router.navigate(['officer']);
      return false;
    } else if (curPage === 'director') {
      this.router.navigate(['director']);
      return false;
    }
    return true;
  }
}
