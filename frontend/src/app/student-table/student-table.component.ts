import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { drive,  filtered_student, studentTableFilterOptions, studentTableFilterResponse } from '../models/model';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';


export interface student_table_data{
  action : string,
  open_as : string,
  drive : drive|null,
  filters:studentTableFilterOptions
}

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit{

  @Output() close_student_table = new EventEmitter<{
    response_for : string,
    close:boolean,
    applied_filters:studentTableFilterOptions,
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
  filters! : studentTableFilterOptions;


  checked_students:Set<string> = new Set();
  checked_depts:Set<string> = new Set();

  gender = ''
  sslc_medium = ''
  hsc_medium = ''
  sslc_board = ''
  hsc_board = ''
  all_checked = false

  
  batch = ''

  enable_hsc = true
  enable_diploma = false

  sslc_percent = [0, 100]
  hsc_percent = [0, 100 ]
  hsc_cutoff = [0, 200]
  diploma_percent = [0, 100]
  cgpa = [0, 10]

  backlogs = [false, false]
  status = [true, true]

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.filters = this.student_table_popup_data.filters
    this.configureAll(this.filters)

    if(this.student_table_popup_data.open_as == 'eligible_lst'){
      console.log(this.student_table_popup_data)
      
      
      this.applyFilters()
      
      this.filtered_students.forEach(student => {
        if(this.checked_students.has(student.reg_no)){ 
          student.checked = true
          this.updateCheckedStudents(student, false)
        }
      })
    }
    else {
      let cur_round = Number(this.student_table_popup_data.open_as)
      let last_round = this.student_table_popup_data.drive?.rounds.length!
      console.log(cur_round, last_round)
      if(cur_round>last_round){
        this.toastr.info(this.student_table_popup_data.open_as)
      }
    }
  }

  configureAll(filters : studentTableFilterOptions){
    console.log(filters)
    this.checked_students = new Set(filters.checked_students);
    this.depts.forEach(dept => {
      if(filters.departments.includes(dept.name)){
        dept.value = true
      }
    })

    this.gender = filters.gender
    this.sslc_medium = filters.sslc.medium
    this.hsc_medium = filters.hsc.medium
    this.sslc_board = filters.sslc.board
    this.hsc_board = filters.hsc.board
    this.all_checked = false
    
    this.batch = filters.batch

    this.enable_hsc = filters.hsc.enabled
    this.enable_diploma = filters.diploma.enabled

    this.sslc_percent = filters.sslc.percentage
    this.hsc_percent = filters.hsc.percentage
    this.hsc_cutoff = filters.hsc.cutoff
    this.diploma_percent = filters.diploma.percentage
    this.cgpa = filters.ug.cgpa

    this.backlogs = filters.ug.backlogs
    this.status = filters.ug.status
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

  closeTable(save_state:boolean){
    if(save_state){
      this.checked_students.forEach(reg_no => {
        this.checked_depts.add(this.setCheckedDept(reg_no))
      })

      const applied_filters:studentTableFilterOptions = {
        checked_students: [...this.checked_students],
        departments: [...this.checked_depts],
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

      this.close_student_table.emit({
        response_for : this.student_table_popup_data.open_as,
        close:false,
        applied_filters: applied_filters,
      });
    }else{
      this.close_student_table.emit({
        response_for : this.student_table_popup_data.open_as,
        close:false,
        applied_filters: this.student_table_popup_data.filters,
      });
    }
  }
}
