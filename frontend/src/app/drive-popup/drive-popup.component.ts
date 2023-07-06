import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, drive, serverResponse } from '../models/model';
import { student_table_data } from '../student-table/student-table.component';

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
  
  eligible_depts:Set<string> = new Set();
  company!:string;
  result_ready = false
  eligible_lst_uploaded = false
  result_uploaded = false
  student_table = false

  student_table_popup_data!:student_table_data;

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
  // @Input() checked_students!:Set<string>;
  checked_students:Set<string> = new Set();

  @Output() popup_closed = new EventEmitter<boolean>();
  // @Output() open_student_table = new EventEmitter<boolean>();
  // @Output() student_table_popup_data = new EventEmitter<student_table_data>();

  
  @Output() open_student_table = new EventEmitter<{
    close:boolean,
    checked_students?:Set<string>
  }>();
  // popup_data!:student_table_data;

  addDriveForm = this.builder.group({
    job_role:this.builder.control('',Validators.required),
    date:this.builder.control('',Validators.required),
    description:this.builder.control('',Validators.required),
    mode : this.builder.control('',Validators.required),
    ctc : this.builder.control(0.0,Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]+.?[0-9]+$')])),
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
        ctc : this.data.drive!.ctc
      })

      for(let dept of this.departments){
        if(this.data.drive!.departments.includes(dept.name)) dept.value = true
      }
      if((this.data.drive!.departments).length===this.departments.length) this.allDept = true
    }
     
    this.company = this.data.open_as==='add'?JSON.parse(sessionStorage.getItem('cur_company')!).company : this.data.drive!.company
  }

  closePopup(){
    this.popup_closed.emit(false);
  }

  addDrive(){
    if(this.addDriveForm.valid){
      if(this.someDeptSelected()){
        let formData = new FormData()
        const formattedDate = this.datePipe.transform(this.addDriveForm.value.date, 'yyyy-MM-dd')!;        
        
        let eligible_depts_arr =[...this.eligible_depts]
        let pk = this.data.open_as==='edit'?(this.data.drive!.id).toString():''

        formData.append('pk', pk)
        formData.append('company',this.company)
        formData.append('job_role',this.addDriveForm.value.job_role!)
        formData.append('date',formattedDate!)
        formData.append('description',this.addDriveForm.value.description!)
        formData.append('mode',this.addDriveForm.value.mode!)
        formData.append('eligible_depts',eligible_depts_arr.join(','))
        formData.append('ctc',(this.addDriveForm.value.ctc!).toString())

        this.service.addCompanyDrive(formData, this.data.open_as).subscribe(
          (res:serverResponse)=>{
            if(res.success){
              this.toastr.success(res.message);
              this.popup_closed.emit(false);
            }else{
              this.toastr.warning(res.message);
            }
          },
          err=>{
            this.toastr.error('Server Not Responding!!');
            this.popup_closed.emit(false);
          }
        )
        

      }
      else this.toastr.warning('Please select Eligible Departments!!');
      
    }else this.toastr.error('Form Invalid!!');
    
  }

  handleStudentTable(value : any){
    this.student_table = value.close
    if(value.checked_students.size>0){
      this.eligible_lst_uploaded = true 
      this.checked_students = value.checked_students
      this.eligible_depts = value.depts

    }else this.eligible_lst_uploaded = false
    
    console.log(value.depts)
  }

  openStudentTable(){
    this.student_table = true
    this.student_table_popup_data = {
      action : 'add',
      open_as  : 'eligible_lst',
      drive : this.data.drive!,
      checked_students : this.checked_students
    }
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
