import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit{

  section = 2
  role = this.dataService.user_role
  filter  = 'All'
  startDate = ''
  endDate = ''
  action = 'add'
  visibility = 'Public'

  reminder = false
  reminder_date = ''


  addReportForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    date:this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),
    message:this.builder.control('',Validators.required),
    mode : this.builder.control('',Validators.required),
  });

  ngOnInit(): void {
      this.reminder = false
  }

  constructor(
    private service : AppService,
    private dataService : DataService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { 

  }






  addReport(){
    console.log(this.reminder_date)
  }

  editReport(){

  }

  deleteReport(){

  }

  resetForm(){

  }

}
