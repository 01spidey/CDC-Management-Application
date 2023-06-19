import { Component } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent {
  cur_option = 'reports'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  user_id = this.userData.name

  constructor(
    private dataService : DataService
  ){

  }

  selectMenu(option:string){
    this.cur_option = option
  }

}
