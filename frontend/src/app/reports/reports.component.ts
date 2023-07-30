import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { deptWiseReportData } from '../models/model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  section = 1

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  batch:number = 0
  cur_year = 0
  batch_lst:number[] = []
  sel_month:string = 'All'

  months:string[] = ['All', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  month_lst = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec']

  DeptWiseReportData : deptWiseReportData[] = [ ]
  
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

  VISITED_COMPANIES:MatTableDataSource<any> = new MatTableDataSource<any>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,12,13,14,15,16,17,18,19,20,
    21,22,23,24,25,26,27,28,29,30
  ]);

  displayedColumns: string[] = ['s.no', 'company', 'category', 'ctc', 'drive date', 'dept', 'total offers']; // Add your table column names here
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  
  ngOnInit(): void {
    // this.initTable()
    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
    this.batch = this.cur_year+1;

    this.getDeptWiseReportData()
  }

  initTable(){
    const data = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30
    ]
    this.VISITED_COMPANIES = new MatTableDataSource(data);
  }

  ngAfterViewInit(): void {
    this.VISITED_COMPANIES.paginator = this.paginator;

    // this.visited_companies = new MatTableDataSource(data);
    // this.visited_companies.paginator = this.paginator;
  }


  onBatchChange(selectedBatch:string){
    this.batch = parseInt(selectedBatch)
    this.getDeptWiseReportData()
  }

  onMonthChange(selectedMonth:string){
    this.sel_month = selectedMonth
    this.getDeptWiseReportData()
  }

  getTotalDeptWiseReportData(deptWiseReportData: deptWiseReportData[]){
    // console.log(deptWiseReportData.length)

    this.deptWiseReportDataTotal = {
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
    let user_id = this.role==='Director'?'Director':(this.userData.staff_id!)
    this.service.getDeptWiseReportData(this.batch, this.sel_month, user_id).subscribe(
      (res:{
        success:boolean,
        data:deptWiseReportData[]
      })=>{
        let temp:deptWiseReportData[] = res.data
        
        console.log(res)

        this.DeptWiseReportData = temp
        this.getTotalDeptWiseReportData(this.DeptWiseReportData)
      },
      (err:any)=>{
        this.toastr.error('Something went wrong!')
      }
    )
  }


}

