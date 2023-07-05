import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { drive,  filtered_student, studentTableFilterOptions, studentTableFilterResponse } from '../models/model';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';


export interface student_table_data{
  action : string,
  open_as : string,
  drive : drive|null
}

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit{

  @Output() close_student_table = new EventEmitter<boolean>();
  @Input() student_table_popup_data!:student_table_data;

  depts = [
    {name:'CSE',value:true},
    {name:'AI-DS',value:false},
    {name:'ECE',value:false},
    {name:'EEE',value:false},
    {name:'BME',value:false},
    {name:'MECH',value:false},
    {name:'CIVIL',value:false},
    {name:'CHEM',value:false},
  ]

  filtered_students:filtered_student[] = []
  filtered_student_count = 0
  checked_students : Set<string> = new Set();
  total_filtered_students:filtered_student[] = []

  gender = 'All'
  sslc_medium = 'All'
  hsc_medium = 'All'
  sslc_board = 'All'
  hsc_board = 'All'
  all_checked = false
  
  batch = '2024'

  enable_hsc = true
  enable_diploma = false

  sslc_percent = [0,100]
  hsc_percent = [0,100]
  hsc_cutoff = [0,200]
  diploma_percent = [0,100]
  cgpa = [0.0, 10.0]

  backlogs = [false, false]
  status = [true, true]

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.student_table_popup_data = {
      action : 'add',
      open_as : 'eligible_lst',
      drive : null,
    }
    if(this.student_table_popup_data.action == 'add'){
      this.applyFilters()
    }
    console.log(this.student_table_popup_data)    
  }

  applyFilters(){
    const filters:studentTableFilterOptions = {
      departments: this.depts.filter(dept => dept.value).map(dept => dept.name),
      batch: this.batch,
      gender: this.gender,
      sslc: {
        medium: this.sslc_medium,
        board: this.sslc_board,
        percentage: this.sslc_percent
      },
      hsc: {
        enabled: this.enable_hsc,
        medium: this.hsc_medium,
        board: this.hsc_board,
        percentage: this.hsc_percent,
        cutoff: this.hsc_cutoff
      },
      diploma: {
        enabled: this.enable_diploma,
        percentage: this.diploma_percent
      },
      ug: {
        cgpa: this.cgpa,
        backlogs: this.backlogs,
        status: this.status
      }
    }

    this.total_filtered_students.push(...this.filtered_students)
    this.filtered_students = []
    this.filtered_student_count = 0
    this.all_checked = false

    this.appService.getEligibleStudents(filters).subscribe(
      (res:studentTableFilterResponse) => {
        // console.log(res.filtered_students)
        this.filtered_students = res.filtered_students
        
        console.log(this.filtered_students.length)
        console.log(this.total_filtered_students.length)
        this.toastr.success('Filter Applied!!')
      },
      (err) => {
        this.toastr.error('Server Not Responding!')
      }
    )

    // console.log(filters)
  }

  setAllChecked(val:boolean){
    this.all_checked = val
    this.filtered_students.forEach(student => {
      student.checked = val
    })
  }

  saveList(){
    this.total_filtered_students.push(...this.filtered_students)
    // console.log(this.total_filtered_students.length)
    this.total_filtered_students.forEach(student => {
      if(student.checked){
        this.checked_students.add(student.reg_no)
      }
    })
    console.log(this.checked_students)
  }

  updateCheckedStudents(student:filtered_student){
    if(student.checked){ 
      this.filtered_student_count += 1
    }
    else{
      this.filtered_student_count -= 1
    }

    if(this.filtered_student_count == this.filtered_students.length) this.all_checked = true
    else this.all_checked = false
  }

  closeTable(){
    this.close_student_table.emit(false);
  }
}
