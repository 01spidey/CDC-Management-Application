import { Component } from '@angular/core';
import { user } from '../models/model';

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.scss']
})
export class DirectorDashboardComponent {
  
  cur_option = 'team'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  user_id = this.userData.name

  constructor(){

  }

  

  selectMenu(option:string){
    this.cur_option = option
  }

}
