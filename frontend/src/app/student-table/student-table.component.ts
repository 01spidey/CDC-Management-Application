import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { drive,  filtered_student, studentTableFilterOptions, studentTableFilterResponse } from '../models/model';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';


export interface student_table_data{
  action : string,
  open_as : string,
  drive : drive|null,
  checked_students:Set<string>
}

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit{

  @Output() close_student_table = new EventEmitter<{
    close:boolean,
    checked_students?:Set<string>,
    depts:Set<string>
  }>();

  
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
  checked_depts:Set<string> = new Set();

  gender = 'All'
  sslc_medium = 'All'
  hsc_medium = 'All'
  sslc_board = 'All'
  hsc_board = 'All'
  all_checked = false

  first_load = true
  
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
    

    this.checked_students = this.student_table_popup_data.checked_students
    console.log(this.checked_students)
    if(this.student_table_popup_data.action == 'add'){
      this.applyFilters()
    }
    
    this.filtered_students.forEach(student => {
      if(this.checked_students.has(student.reg_no)){ 
        student.checked = true
        this.updateCheckedStudents(student, false)
      }
    })

  }

  clearAll(){
    this.checked_students.clear()
    this.filtered_students.forEach(student => {
      student.checked = false
    })
    this.all_checked = false
  }

  viewSelected(){
    this.filtered_students = []
    this.filtered_student_count = 0

    this.all_checked = false

    this.appService.onlySelected(this.checked_students).subscribe(
      (res:studentTableFilterResponse) => {
        this.filtered_students = res.filtered_students

        this.filtered_students.forEach(student => {
          this.updateCheckedStudents(student, false)
        })
      },
      (err) => {
        this.toastr.error('Server Not Responding!')
      }
    )
  }

  applyFilters(){
    
    // console.log(this.checked_students)
    
    const filters:studentTableFilterOptions = {
      checked_students: [...this.checked_students],
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


    this.filtered_students = []
    this.filtered_student_count = 0

    this.all_checked = false

    this.appService.getEligibleStudents(filters).subscribe(
      (res:studentTableFilterResponse) => {
        this.filtered_students = res.filtered_students
        let a=0
        this.filtered_students.forEach(student => {
          this.updateCheckedStudents(student, false)
        })
        this.first_load = false

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
    this.filtered_student_count = 0
    this.filtered_students.forEach(student => {
      student.checked = val
      this.updateCheckedStudents(student, true)
    })
    console.log(this.checked_students)
  }

  updateCheckedStudents(student:filtered_student, manual:boolean){
    if(student.checked){ 
      this.filtered_student_count += 1
      this.checked_students.add(student.reg_no)
      // console.log(student.reg_no+" "+this.filtered_student_count)
    }
    else{
      if(manual){ 
        this.filtered_student_count -= 1
        this.checked_students.delete(student.reg_no)
      }
    }

    if(this.filtered_student_count == this.filtered_students.length) this.all_checked = true
    else this.all_checked = false

    // console.log(this.filtered_student_count+" "+this.filtered_students.length)
  }

  setCheckedDept(reg_no:string):string{
    let val = reg_no.substring(2,4)
    val = val==='CS'? 'CSE': 
    val==='AD'? 'AI-DS': 
    val==='EC'? 'ECE': 
    val==='EE'? 'EEE': 
    val==='BM'? 'BME': 
    val==='ME'? 'MECH': 
    val==='CE'? 'CIVIL': 
    val==='CH'? 'CHEM': 'NA'

    return val

  }

  closeTable(){
    // console.log(this.checked_students)
    this.checked_students.forEach(reg_no => {
      this.checked_depts.add(this.setCheckedDept(reg_no))
    })

    this.close_student_table.emit({
      close:false,
      checked_students: this.checked_students,
      depts: this.checked_depts
    });
  }
}
