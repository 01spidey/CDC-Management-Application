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
  company!:string;

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

  @Input() data!:drive_popup_data;
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
    //console.log(this.data)
    if(this.data.open_as == 'edit'){

      this.addDriveForm.patchValue({
        job_role : this.data.drive!.job_role,
        date : this.patchDate(this.data.drive!.date),
        description : this.data.drive!.description,
        mode : this.data.drive!.mode,
      })

      for(let dept of this.departments){
        if(this.data.drive!.departments.includes(dept.name)) dept.value = true
      }
      if((this.data.drive!.departments).length===this.departments.length) this.allDept = true
    }
     
    this.company = this.data.open_as==='add'?JSON.parse(sessionStorage.getItem('cur_company')!).company : this.data.drive!.company
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
        const formattedDate = this.datePipe.transform(this.addDriveForm.value.date, 'yyyy-MM-dd')!;        
        
        for(let dept of this.departments){
          if(dept.value) this.eligible_depts.push(dept.name)
        };
        let pk = this.data.open_as==='edit'?(this.data.drive!.id).toString():''
        //console.log(pk)
        formData.append('pk', pk)
        formData.append('company',this.company)
        formData.append('job_role',this.addDriveForm.value.job_role!)
        formData.append('date',formattedDate!)
        formData.append('description',this.addDriveForm.value.description!)
        formData.append('eligible_lst',this.selectedFile!)
        formData.append('mode',this.addDriveForm.value.mode!)
        formData.append('eligible_depts',this.eligible_depts.join(','))

        this.service.addCompanyDrive(formData, this.data.open_as).subscribe(
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

  patchDate(dateString: string) : string{
    const parts = dateString.split('-');
    let day = parts[0];
    let month:string = parts[1] ;
    day = day.length==1?`0${day}`:day
    month = month.length==1?`0${month}`:month
    const year = +parts[2];
    const formattedDate = `${year}-${month}-${day}`; 
    //console.log(formattedDate)
    return formattedDate;
  }
}
