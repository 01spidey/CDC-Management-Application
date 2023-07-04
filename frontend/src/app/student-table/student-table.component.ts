import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { drive } from '../models/model';


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

  depts = ["CSE","AI-DS","ECE","EEE","BME","MECH","CIVIL","CHEM"]
  gender = 'All'
  sslc_medium = 'All'
  hsc_medium = 'All'
  sslc_board = 'All'
  hsc_board = 'All'

  ngOnInit(): void {
    this.student_table_popup_data = {
      action : 'add',
      open_as : 'eligible_lst',
      drive : null,
    }
    console.log(this.student_table_popup_data)    
  }

  closeTable(){
    this.close_student_table.emit(false);
  }
}
