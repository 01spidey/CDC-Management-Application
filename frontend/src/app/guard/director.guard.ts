import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class DirectorGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    //console.log('director guard');
    let curPage = sessionStorage.getItem('cur_page');

    curPage = (curPage==null || curPage==='home')?'' : curPage

    if(curPage==='director') return true
    
    this.router.navigate([curPage])
    
    return false

  }
}
