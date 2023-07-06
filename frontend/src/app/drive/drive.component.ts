import { Component, OnInit } from '@angular/core';
import { drive, driveByIdResponse, driveByStatusResponse, serverResponse } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { drive_popup_data } from '../drive-popup/drive-popup.component';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  section = 1 
  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  cur_staff_id:string = this.userData.staff_id

  drive_lst:drive[] = []
  selectedFile: File | null = null;
  filter = 'All'
  show_desc = ''
  show_delete = ''
  action = 'add'

  edit_drive_id = 0
  drive_popup = false
  drive_popup_data!:drive_popup_data;
  student_table = false

  startDate!: string;
  endDate!: string;

  addDriveForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    job_role:this.builder.control('',Validators.required),
    date:this.builder.control('',Validators.required),
    website:this.builder.control('',Validators.required),
    category : this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),
    description:this.builder.control('',Validators.required),
    file : this.builder.control(''),
    mode : this.builder.control('',Validators.required),
  });

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) {  }

  ngOnInit(): void {
      this.drive_lst = [ ]
      
      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      const threeMonthsAfter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
      
      this.startDate = this.datePipe.transform(threeMonthsAgo, 'yyyy-MM-dd')!;
      this.endDate = this.datePipe.transform(threeMonthsAfter, 'yyyy-MM-dd')!;
      
      this.filterByStatus(this.filter)
  }

  filterByStatus(status:string){

    sessionStorage.setItem('status',status)
    this.filter = status

    if (status === 'Today' || status === 'Upcoming') {
      // console.log(status)
     
      this.service.getDriveByStatus(status).subscribe(
        (res:driveByStatusResponse)=>{
          this.drive_lst = res.drive_lst
          if(!res.success) this.toastr.warning('Some Technical Error!!');
        },
        (err)=>{
          this.toastr.error("Server Not Responding!!")
        }
      )
    }

    else{
      // this.drive_lst = []
      const startDate = this.startDate ? formatDate(this.startDate, 'yyyy-MM-dd', 'en') : '';
      const endDate = this.endDate ? formatDate(this.endDate, 'yyyy-MM-dd', 'en') : '';

      const formData = new FormData();
      formData.append('status', status);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);

      this.service.getDriveByDateRange(formData).subscribe(
        (res: driveByStatusResponse) => {
          this.drive_lst = res.drive_lst;

          if(!res.success) this.toastr.warning('Technical Error!!');
        },
        err => {
          this.toastr.error('Server Not Responding!!');
        }
      );
    }

  }


  deleteDrive(drive_id : number){
    let formData = new FormData()
    
    formData.append('drive_id',drive_id.toString())

    this.service.delete_drive(formData).subscribe(
      (res:serverResponse)=>{
        if(res.success){
          this.toastr.success(res.message)
          this.filterByStatus(this.filter)
        }
        else this.toastr.warning(res.message)
      },
      err=>{
        this.toastr.warning('Server Not Responding!!')
      }
    )
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  resetForm(){
    this.addDriveForm.reset()
  }

  handleDrivePopup(value:boolean){
    this.drive_popup = value
    this.filterByStatus(this.filter)
  }

  handleStudentTable(value : any){
    this.student_table = value.close 
    if(value) this.toastr.info('Opening Student Table')
    else this.toastr.info('Closing Student Table')
  }

  openDrivePopup(drive:drive){
    // console.log(drive)
    drive.departments = drive.departments===null?[]:drive.departments
    this.drive_popup_data = {
      open_as : 'edit',
      drive : drive
    }
    this.drive_popup = true
  }

}
