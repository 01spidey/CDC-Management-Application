import { Component } from '@angular/core';
import { user } from '../models/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.scss']
})
export class DirectorDashboardComponent {
  
  cur_option = 'summary'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  user_id = this.userData.name

  constructor(
    private router: Router,
  ){

  }

  logout(){
    sessionStorage.setItem('user_id', 'null')
    this.router.navigate(['login'])
  }
  

  selectMenu(option:string){
    this.cur_option = option
  }

}
