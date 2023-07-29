import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { deptWiseReportData } from '../models/model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  section = 1

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  batch:number = 0
  cur_year = 0
  batch_lst:number[] = []
  sel_month:string = 'All'

  months:string[] = ['All', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  deptWiseReportData : deptWiseReportData[] = [ ]
  
  deptWiseReportDataTotal = {
    total: 0,
    interested: 0,
    placed: 0,
    remaining: 0,
    ctc : {
      gt20: 0,
      gt15: 0,
      gt10: 0,
      gt8: 0,
      gt7: 0,
      gt6: 0,
      gt5: 0,
      gt4: 0,
      lt4: 0
    },
    total_percent: 0
  }


  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
    this.batch = this.cur_year+1;

    this.deptWiseReportData = [
      {
        pos: 1,
        dept: 'CSE',
        total: 100,
        interested: 80,
        placed: 60,
        remaining: 20,
        ctc: {
          gt20: 10,
          gt15: 20,
          gt10: 5,
          gt8: 6,
          gt7: 15,
          gt6: 4,
          gt5: 0,
          gt4: 0,
          lt4: 0
        },
        total_percent: 80
      }
    ]

    this.getTotalDeptWiseReportData(this.deptWiseReportData)

  }


  onBatchChange(selectedBatch:string){
    this.batch = parseInt(selectedBatch)
    // this.applyFilter(this.status_filter, this.job_type_filter)
  }

  onMonthChange(selectedMonth:string){
    this.sel_month = selectedMonth
    // this.applyFilter(this.status_filter, this.job_type_filter)
  }

  getTotalDeptWiseReportData(deptWiseReportData: deptWiseReportData[]){
    deptWiseReportData.forEach((dept)=>{
      this.deptWiseReportDataTotal.total += dept.total
      this.deptWiseReportDataTotal.interested += dept.interested
      this.deptWiseReportDataTotal.placed += dept.placed
      this.deptWiseReportDataTotal.remaining += dept.remaining
      this.deptWiseReportDataTotal.ctc.gt20 += dept.ctc.gt20
      this.deptWiseReportDataTotal.ctc.gt15 += dept.ctc.gt15
      this.deptWiseReportDataTotal.ctc.gt10 += dept.ctc.gt10
      this.deptWiseReportDataTotal.ctc.gt8 += dept.ctc.gt8
      this.deptWiseReportDataTotal.ctc.gt7 += dept.ctc.gt7
      this.deptWiseReportDataTotal.ctc.gt6 += dept.ctc.gt6
      this.deptWiseReportDataTotal.ctc.gt5 += dept.ctc.gt5
      this.deptWiseReportDataTotal.ctc.gt4 += dept.ctc.gt4
      this.deptWiseReportDataTotal.ctc.lt4 += dept.ctc.lt4
      this.deptWiseReportDataTotal.total_percent += dept.total_percent
    })

  }

  getDeptWiseReportData(){
    this.service.getDeptWiseReportData(this.batch, this.sel_month).subscribe(
      (res:any)=>{
        console.log(res)
      },
      (err:any)=>{
        
      }
    )
  }


}

