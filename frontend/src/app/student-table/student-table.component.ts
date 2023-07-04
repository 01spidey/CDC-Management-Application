import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent {

  @Output() close_student_table = new EventEmitter<boolean>();



  closeTable(){
    this.close_student_table.emit(false);
  }
}
