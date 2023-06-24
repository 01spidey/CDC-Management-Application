import { Component } from '@angular/core';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent {
  cur_option = 'drive'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  user_id = this.userData.name

  constructor( ){

  }

  selectMenu(option:string){
    this.cur_option = option
  }

}
