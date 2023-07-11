import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, drive, serverResponse, studentTableFilterOptions } from '../models/model';
import { student_table_data } from '../student-table/student-table.component';
import * as moment from 'moment';


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
  
  eligible_depts:string[] = []
  company!:string;
  result_ready = false
  eligible_lst_uploaded = false
  result_uploaded = false
  student_table = false

  add_round = false
  new_round_added = false
  round_list_uploaded = false
  round_name = 'NA'
  last_round = 0
  drive_completed = false

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
  checked_students:string[] = []

  filters : studentTableFilterOptions = {
    drive_id : null,
    round : 0,
    final_round : false,
    checked_students: [],
    departments: [],
    batch: '2024',
    gender: 'All',
    sslc: {
      medium: 'All',
      board: 'All',
      percentage: [0, 100]
    },
    hsc: {
      enabled: true,
      medium: 'All',
      board: 'All',
      percentage: [0, 100],
      cutoff: [0, 200]
    },
    diploma: {
      enabled: false,
      percentage: [0, 100]
    },
    ug: {
      cgpa: [0, 10],
      backlogs: [false, false],
      status: [true, true]
    }
  }

  rounds : {
    num:number,
    name:string,
  }[] = []

  @Output() popup_closed = new EventEmitter<boolean>();

  
  @Output() open_student_table = new EventEmitter<{
    close:boolean,
    checked_students?:Set<string>
  }>();

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
    if(this.data.open_as == 'edit'){
      this.drive_completed = this.data.drive!.completed
      this.filters = this.data.drive!.filters
      this.checked_students = this.filters.checked_students
      this.eligible_depts = this.filters.departments
      
      this.eligible_lst_uploaded = true
      this.result_ready = this.driveStarted(this.data.drive!.date)

      this.rounds = [...this.data.drive!.rounds]
      this.rounds.splice(0,1)
      this.last_round = this.rounds.length
    

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
      if(this.checked_students.length>0){
        let formData = new FormData()
        const formattedDate = this.datePipe.transform(this.addDriveForm.value.date, 'yyyy-MM-dd')!;        
      
        let pk = this.data.open_as==='edit'?(this.data.drive!.id).toString():''

        console.log(this.filters)
        formData.append('pk', pk)
        formData.append('company',this.company)
        formData.append('job_role',this.addDriveForm.value.job_role!)
        formData.append('date',formattedDate!)
        formData.append('description',this.addDriveForm.value.description!)
        formData.append('mode',this.addDriveForm.value.mode!)
        formData.append('eligible_depts',this.eligible_depts.join(','))
        formData.append('ctc',(this.addDriveForm.value.ctc!).toString())
        formData.append('filters', JSON.stringify(this.filters))
        formData.append('round_name', this.round_name)

        // console.log(this.filters)
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
      else this.toastr.warning('Please Generate Eligible List!!');
      
    }else this.toastr.error('Form Invalid!!');
    
  }

  handleStudentTable(value : { response_for : string,close:boolean, applied_filters:studentTableFilterOptions}){
    this.student_table = value.close
    const applied_filters = value.applied_filters
    this.filters = applied_filters
    
    console.log(value)
    this.round_name = value.response_for.split('^')[1]

    if(this.round_name === 'Eligible List'){
      this.checked_students = applied_filters.checked_students
      this.eligible_depts = applied_filters.departments

      if(applied_filters.checked_students.length>0){
        this.eligible_lst_uploaded = true   
        this.filters = applied_filters
      }else this.eligible_lst_uploaded = false
    }

    else{
      let round_num = Number(value.response_for.split('^')[0])
      
      if(applied_filters.checked_students.length>0){
        this.filters.checked_students = applied_filters.checked_students
        if(round_num>this.rounds.length){
          this.rounds.push({
            num : round_num,
            name : this.round_name
          })
          this.last_round = this.rounds.length
          this.result_ready = false
        }
      }
    }
    
    
  }

  openStudentTable(){
    this.student_table = true
    this.student_table_popup_data = {
      action : this.data.open_as,
      open_as  : 'eligible_lst',
      drive : this.data.drive!,
      filters : this.filters
    }
  }

  openStudentTableforRound(round: {num:number, name:string}){
    this.student_table = true
    // console.log
    this.student_table_popup_data = {
      action : this.data.open_as,
      open_as  : round.num.toString(),
      drive : this.data.drive!,
      filters : this.filters
    }
    // let x = round.key
  }

  addOfferDetails(){
    this.student_table = true
    this.student_table_popup_data = {
      action : this.data.open_as,
      open_as  : 'offer_details',
      drive : this.data.drive!,
      filters : this.filters
    }
  }

  patchDate(dateString: string) : string{
    const parts = dateString.split('-');
    let day = parts[0];
    let month:string = parts[1] ;
    day = day.length==1?`0${day}`:day
    month = month.length==1?`0${month}`:month
    const year = +parts[2];
    const formattedDate = `${year}-${month}-${day}`; 
    return formattedDate;
  }

  driveStarted(date_str: string): boolean {
    const today = moment();
    const date = moment(date_str, 'DD-MM-YYYY');

    // Compare the dates
    return date.isSameOrBefore(today, 'day');
  }

}


