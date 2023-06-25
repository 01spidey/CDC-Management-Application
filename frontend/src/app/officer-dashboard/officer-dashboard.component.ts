import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent {
  cur_option = 'drive'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  user_id = this.userData.name

  constructor( 
    private router: Router,
    private location : Location
  ){

  }

  selectMenu(option:string){
    this.cur_option = option
  }

  logout(){
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('cur_user_data')
    this.router.navigate(['/login'])
    // this.location.back()
  }

}
