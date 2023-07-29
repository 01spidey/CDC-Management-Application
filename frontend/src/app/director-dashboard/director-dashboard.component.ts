import { Component, OnInit } from '@angular/core';
import { user } from '../models/model';
import { Router } from '@angular/router';
import { ImplicitReceiver } from '@angular/compiler';

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.scss']
})
export class DirectorDashboardComponent implements OnInit{
  
  cur_option = 'reports'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  user_id = this.userData.name

  constructor(
    private router: Router,
  ){ }

  ngOnInit(): void {
    sessionStorage.setItem('cur_page', 'director')
  }

  logout(){
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('cur_user_data')
    sessionStorage.setItem('cur_page', '')
    this.router.navigate(['login'])
  }
  

  selectMenu(option:string){
    this.cur_option = option
  }

}
