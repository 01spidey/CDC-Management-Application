import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  constructor(
    private dataService: DataService,
    private toastr:ToastrService
  ) { 

  }
  section = 1
  role = this.dataService.user_role
  filter  = 'All'
  startDate = ''
  endDate = ''

}
