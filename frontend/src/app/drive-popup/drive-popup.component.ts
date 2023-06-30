import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, drive, serverResponse } from '../models/model';

export interface drive_popup_data{
  open_as : string,
  drive : drive|null
}
export interface checkBox{
  name:string,
  value:boolean
}

@Component({
  selector: 'app-drive-popup',
  templateUrl: './drive-popup.component.html',
  styleUrls: ['./drive-popup.component.scss']
})
export class DrivePopupComponent implements OnInit{
  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  cur_user_id:string = this.userData.user_id
  selectedFile: File | null = null;
  
  eligible_depts:string[] = []
  cur_company!:company;

  departments = [
    {name:'CSE',value:false},
    {name:'AI-DS',value:false},
    {name:'ECE',value:false},
    {name:'EEE',value:false},
    {name:'BME',value:false},
    {name:'MECH',value:false},
    {name:'CIVIL',value:false},
    {name:'CHEM',value:false},
  ]

  @Input() data:drive_popup_data = {
    open_as : 'add',
    drive : null
  }

  @Output() popup_closed = new EventEmitter<boolean>();


  addDriveForm = this.builder.group({
    job_role:this.builder.control('',Validators.required),
    date:this.builder.control('',Validators.required),
    description:this.builder.control('',Validators.required),
    file : this.builder.control(''),
    mode : this.builder.control('',Validators.required),
  });

  allDept: boolean = false;

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) {  }

  ngOnInit(): void {
    this.data = {
      open_as : 'add',
      drive : null
    }
    console.log(this.data) 
    this.cur_company = JSON.parse(sessionStorage.getItem('cur_company')!)
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  closePopup(){
    this.popup_closed.emit(false);
  }

  addDrive(){
    if(this.addDriveForm.valid){
      if(this.someDeptSelected()){
        let formData = new FormData()
        const formattedDate = this.datePipe.transform(this.addDriveForm.value.date!, 'dd-MM-yyyy');        
        
        for(let dept of this.departments){
          if(dept.value) this.eligible_depts.push(dept.name)
        };
        
        formData.append('company',this.cur_company.company)
        formData.append('job_role',this.addDriveForm.value.job_role!)
        formData.append('date',formattedDate!)
        formData.append('description',this.addDriveForm.value.description!)
        formData.append('eligible_lst',this.selectedFile!)
        formData.append('mode',this.addDriveForm.value.mode!)
        formData.append('eligible_depts',this.eligible_depts.join(','))

        this.service.addCompanyDrive(formData).subscribe(
          (res:serverResponse)=>{
            this.eligible_depts = []
            if(res.success){
              this.toastr.success(res.message);
              this.popup_closed.emit(false);
            }else{
              this.toastr.warning(res.message);
            }
          },
          err=>{
            this.toastr.error('Server Not Responding!!');
            this.eligible_depts = []
            this.popup_closed.emit(false);
          }
        )
        

      }else this.toastr.warning('Please select Eligible Departments!!');
      
    }else this.toastr.error('Form Invalid!!');
    
  }

  editDrive(){

  }

  setAllDept(value: boolean){
    this.allDept = !this.allDept;
    if(value){
      this.departments.forEach((dept)=>{
        dept.value = true;
      })
    }
    else{
      this.departments.forEach((dept)=>{
        dept.value = false;
      })
    }
    
  }

  updateAllDept(){
    // this.allDept = false;
    let bool = true;
    this.departments.forEach((dept)=>{
      if(!dept.value){
        bool = false;
      }
    })
    this.allDept = bool;
  }

  someDeptSelected():boolean{
    let bool = false;
    for(let dept of this.departments){
      if(dept.value){
        bool = true;
        return bool;
      }
    }
    return bool;
  }
}
