import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent implements OnInit {
  cur_option = 'dash'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  user_id = this.userData.name

  constructor( 
    private router: Router,
    private location : Location
  ){ }

  ngOnInit(): void {
    sessionStorage.setItem('cur_page', 'officer')
  }

  selectMenu(option:string){
    this.cur_option = option
  }

  logout(){
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('cur_user_data')
    sessionStorage.setItem('cur_page', '')
    this.router.navigate(['/login'])
    // this.location.back()
  }

}
