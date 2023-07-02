import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // console.log('login guard');
    const curPage = sessionStorage.getItem('cur_page');

    if (curPage === 'home' || curPage==null) {
      this.router.navigate(['']);
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
