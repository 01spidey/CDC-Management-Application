import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Report, serverResponse } from '../models/model';
import { AppService } from '../service/app.service';

export interface popup_data{
  open_as : string,
  report : any
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  reminder = false
  reminder_date = ''
  allow_date = false
  date = ''
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!)

  @Input() data!:popup_data;

  @Output() popup_closed = new EventEmitter<boolean>();

  constructor(
    private builder:FormBuilder,
    private datePipe : DatePipe,
    private toastr : ToastrService,
    private service : AppService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    if(this.data.open_as==='edit'){
      this.reportForm.patchValue({
        message : this.data.report.message,
      })
      // this.date = this.patchDate(this.data.report.date)

      if(this.data.report.reminder_date==='') this.reminder = false
      else{
        this.reminder = true
        this.reminder_date = this.patchDate(this.data.report.reminder_date)
      }
    }     
  }

  reportForm:FormGroup = this.builder.group({
    message : this.builder.control('',Validators.required),
  })

  addReport(){
    let converted_date = this.datePipe.transform(this.date, 'yyyy-MM-dd')!;
    let converted_reminder_date = (!this.reminder)?'' : this.datePipe.transform(this.reminder_date, 'yyyy-MM-dd');
    
    if(this.reportForm.valid){
      if(this.reminder && this.reminder_date==='') this.toastr.warning('Reminder Date Invalid!!')
      else{
        let data = {
          pk : this.data.report.pk,
          message : this.reportForm.value.message,
          date : converted_date,
          reminder_date : converted_reminder_date,
          company : this.data.report.company,
          staff_id : this.userData.staff_id, 
          action : this.data.open_as 
        }
          
        this.service.addAndUpdateCompanyReport(data).subscribe(
          (res : serverResponse)=>{
            if(res.success) this.toastr.success(res.message)
            else this.toastr.error(res.message)
            this.closePopup()
          },
          err=>{
            this.toastr.error('Error Adding Report!!')
          }
        )
      
      }
      
    } else this.toastr.warning('Invalid Form!!')
  }

  closePopup(){
    this.popup_closed.emit(false)
  }

  patchDate(dateString: string) : string{
    const parts = dateString.split('-');
    let day = parts[0];
    let month:string = parts[1] ;
    day = day.length==1?`0${day}`:day
    month = month.length==1?`0${month}`:month
    const year = +parts[2];
    const formattedDate = `${year}-${month}-${day}`; // Convert back to 'dd-mm-yyyy' format
    console.log(formattedDate)
    return formattedDate;
    // 2023-07-01
  }

  



}
