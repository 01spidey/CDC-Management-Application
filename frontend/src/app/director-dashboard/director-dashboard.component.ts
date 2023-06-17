import { Component } from '@angular/core';
import { user } from '../models/model';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.scss']
})
export class DirectorDashboardComponent {
  
  cur_option = 'team'
  user_id = this.dataService.cur_user_data.name

  constructor(
    private dataService : DataService
  ){

  }

  

  selectMenu(option:string){
    this.cur_option = option
  }

}
