import { Component } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent {
  cur_option = 'drive'
  user_id = this.dataService.cur_user_data.name

  constructor(
    private dataService : DataService
  ){

  }

  selectMenu(option:string){
    this.cur_option = option
  }

}
