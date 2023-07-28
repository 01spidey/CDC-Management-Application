import { Component } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  section = 1
  

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

}
