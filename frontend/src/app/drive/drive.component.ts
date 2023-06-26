import { Component, OnInit } from '@angular/core';
import { drive, driveByIdResponse, driveByStatusResponse, serverResponse } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  section = 1 
  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  cur_user_id:string = this.userData.user_id

  drive_lst:drive[] = []
  selectedFile: File | null = null;
  filter = 'All'
  show_desc = ''
  show_delete = ''
  action = 'add'

  edit_drive_id = 0


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
  ) { 

  }

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
    console.log(status)

    if (status === 'Today' || status === 'Upcoming') {
      // console.log(status)
     
      this.service.getDriveByStatus(status).subscribe(
        (res:driveByStatusResponse)=>{
          console.log(res.drive_lst)
          this.drive_lst = res.drive_lst
          if(res.success) this.toastr.success('Filter Applied!!');
          else this.toastr.warning('Technical Error!!');
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

      // Create FormData object
      const formData = new FormData();
      formData.append('status', status);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);

      // console.log(startDate)
      // console.log(endDate)

      // Send the formData to the backend API
      this.service.getDriveByDateRange(formData).subscribe(
        (res: driveByStatusResponse) => {
          console.log(res.drive_lst);
          this.drive_lst = res.drive_lst;

          if(res.success) this.toastr.success('Filter Applied!!');
          else this.toastr.warning('Technical Error!!');
        },
        err => {
          this.toastr.error('Server Not Responding!!');
        }
      );
    }

  }


  addDrive(){
    if(this.addDriveForm.valid){
      let formData = new FormData()
      const formattedDate = this.datePipe.transform(this.addDriveForm.value.date!, 'dd-MM-yyyy');
      
      formData.append('company',this.addDriveForm.value.company!)
      formData.append('job_role',this.addDriveForm.value.job_role!)
      formData.append('date',formattedDate!)
      formData.append('website',this.addDriveForm.value.website!)
      formData.append('hr_name',this.addDriveForm.value.hr_name!)
      formData.append('hr_mail',this.addDriveForm.value.hr_mail!)
      formData.append('description',this.addDriveForm.value.description!)
      formData.append('eligible_lst',this.selectedFile!)
      formData.append('staff_id',this.userData.staff_id)
      formData.append('mode',this.addDriveForm.value.mode!)
      formData.append('category',this.addDriveForm.value.category!)
      
      console.log(formattedDate)

      this.service.add_drive(formData).subscribe(
        (res:serverResponse)=>{
          if(res.success){
            this.toastr.success(res.message)
            // this.addDriveForm.reset()
          }
          else{
            this.toastr.error(res.message)
          }
        },
        err=>{
          this.toastr.error('Server Not Responding!!')
        }
      )
    }
    else{
      
    }
  }

  getDriveById(drive_id : number){
    this.action = 'edit'
    this.section = 2
    this.edit_drive_id = drive_id

    this.service.getDriveById(drive_id).subscribe(
      (res:driveByIdResponse)=>{
        if(res.success){
          console.log(res.drive)
          this.addDriveForm.patchValue({
            'company':res.drive.company,
            'job_role':res.drive.job_role,
            'date':res.drive.date,
            'website':res.drive.website,
            'hr_name':res.drive.HR_name,
            'hr_mail':res.drive.HR_mail,
            'description':res.drive.description,
            'mode':res.drive.mode,
            'category' : res.drive.category
            // 'file':res.drive.file.toString()
          })

        }else this.toastr.warning('Something Went Wrong!!')
      },
      err=>{
        this.toastr.error('Server Not Responding!!')
      }
    )
  }

  editDrive(){
    let formData:FormData = new FormData()
    const formattedDate = this.datePipe.transform(this.addDriveForm.value.date!, 'dd-MM-yyyy');
      
    formData.append('company',this.addDriveForm.value.company!)
    formData.append('job_role',this.addDriveForm.value.job_role!)
    formData.append('date',formattedDate!)
    formData.append('website',this.addDriveForm.value.website!)
    formData.append('hr_name',this.addDriveForm.value.hr_name!)
    formData.append('hr_mail',this.addDriveForm.value.hr_mail!)
    formData.append('description',this.addDriveForm.value.description!)
    formData.append('eligible_lst',this.selectedFile!)
    formData.append('staff_id',this.userData.staff_id)
    formData.append('mode',this.addDriveForm.value.mode!)
    formData.append('category',this.addDriveForm.value.category!)

    formData.append('drive_id',this.edit_drive_id.toString())

    this.service.edit_drive(formData).subscribe(
      (res:serverResponse)=>{
        if(res.success){
          this.toastr.success(res.message)
          this.section = 1
          this.filterByStatus(this.filter)
        }else{
          this.toastr.warning(res.message)
        }
      },
      err=>{
        this.toastr.error('Server Not Responding!!')
      }
    )
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

  goBack(){
    this.section = 1
    this.filterByStatus(this.filter)
    if(this.action === 'edit') this.action = 'add'
  }

}
