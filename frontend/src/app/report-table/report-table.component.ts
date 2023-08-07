import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { studentData } from '../models/model';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit{

  @Output() closeTable = new EventEmitter<boolean>();
  @Input() studentData!:any;


  student_objs:studentData[] = []

  ngOnInit(): void {

    // console.log(this.studentData)
    this.service.getStudentData(this.studentData).subscribe(
      (res:any) => {
        console.log(res)
        this.student_objs = res.data
      },
      (err:any) => {
        console.log(err)
      }
    )

    // this.student_objs = [
    //   {name: 'Scamander', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    //   {name: 'Dumbledore', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    //   {name: 'Granger', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    //   {name: 'Potter', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    //   {name: 'Weasley', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    //   {name: 'Malfoy', reg_no: '20CS166', dept: 'CSE', batch: '2020-2024'},
    // ]
    
  }

  constructor(
    private service : AppService,
    private toastr:ToastrService
  ) {}

  close(){
    this.closeTable.emit(false)
  }

}
