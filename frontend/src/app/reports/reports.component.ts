import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { DatePipe, formatDate } from '@angular/common';
import { serverResponse } from '../models/model';

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
    
    if(this.reminder_date==='') console.log(this.reminder_date)

    if(this.addReportForm.valid){      
      if(this.reminder && this.reminder_date===''){
        this.toastr.warning('Set reminder date!!')
      }else{
        const formattedDate = this.datePipe.transform(this.addReportForm.value.date!, 'dd-MM-yyyy');
        const formattedReminderDate = (!this.reminder)?'' : this.datePipe.transform(this.reminder_date, 'dd-MM-yyyy');
        // console.log(formattedDate+' '+formattedReminderDate)
        
        let data = {
          company:this.addReportForm.value.company,
          date:formattedDate,
          hr_name:this.addReportForm.value.hr_name,
          hr_mail:this.addReportForm.value.hr_mail,
          message:this.addReportForm.value.message,
          mode : this.addReportForm.value.mode,
          visibility : this.visibility,
          reminder_date : formattedReminderDate,
          staff_id : this.dataService.user_id
        }

        // let data = this.addReportForm.value

        this.service.addReport(data).subscribe(
          (res:serverResponse)=>{
            if(res.success){
              this.toastr.success('Report added successfully')
              this.addReportForm.reset()
              this.reminder = false
            }else{
              this.toastr.warning('Something went wrong')
            }
          },
          (err)=>{
            this.toastr.error('Something went wrong')
          }
        )
      }
      
    }else this.toastr.warning('Form Invalid!!')
    

  }

  editReport(){

  }

  deleteReport(){

  }

  resetForm(){

  }

}
