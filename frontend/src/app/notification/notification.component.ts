import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { driveNotification, notificationResponse, reportNotification} from '../models/model';
import { popup_data } from '../popup/popup.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit{

  user_role = sessionStorage.getItem('user_role')!
  category = 'drive_alerts'
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!)

  drive_notifications : driveNotification[] = [ ]

  report_notifications : reportNotification[] = []

  popup_data!:popup_data;
  popup = false

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.applyFilter('drive_alerts')
    if(this.user_role==='Officer') this.applyFilter('report_alerts')   
  }

  handleValue(value: boolean) {
    this.popup = value
    this.applyFilter('report_alerts')
  }

  applyFilter(category : string) {
    this.category = category;
    // console.log(this.userData)

    this.service.getNotifications(category, this.userData.staff_id).subscribe(
      (res : notificationResponse) =>{
        if(res.success){
          if(category==='drive_alerts') this.drive_notifications = res.notifications as driveNotification[]
          else{
            console.log(res)
            this.report_notifications = res.notifications as reportNotification[]
            console.log(this.report_notifications)
          }
        }else this.toastr.warning('Something went wrong!!')
      },
      err=>{
        console.log(err)
        this.toastr.error('Server Not Responding!!')
      }
    )
    
  }

  openPopup(report:reportNotification){
    console.log(report)
    this.popup = true
    this.popup_data = {
      open_as : 'add',
      report : { 
        pk : report.pk,
        company : report.company
      }
    }
  }

}
