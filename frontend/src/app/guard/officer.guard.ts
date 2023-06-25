import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class OfficerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('officer guard');
    let curPage = sessionStorage.getItem('cur_page');

    curPage = (curPage==null || curPage==='home')?'' : curPage

    if(curPage==='officer') return true
    
    this.router.navigate([curPage])
    
    return false

  }
}
