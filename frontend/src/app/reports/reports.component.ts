import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';
import { deptWiseReportData, getVisitedCompaniesData, visitedCompany } from '../models/model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  section = 1

  student_table = false

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

  studentData:any = []

  VISITED_COMPANIES!:MatTableDataSource<visitedCompany>;

  displayedColumns: string[] = ['s.no', 'company', 'category', 'mode', 'ctc', 'drive date', 'ai-ds', 'cse', 'ece', 'eee', 'bme', 'chem', 'civil', 'mech', 'total offers']; // Add your table column names here
  pageSizeOptions: number[] = [3, 5, 10, 15];

  constructor(
    private service : AppService,
    private toastr:ToastrService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator

  visitedCompanies:visitedCompany[] = []

  totalOfferData:{
    ai_ds : number,
    cse : number,
    ece : number,
    eee : number,
    bme : number,
    chem : number,
    civil : number,
    mech : number,
    total : number
  } = {
    ai_ds: 0,
    cse: 0,
    ece: 0,
    eee: 0,
    bme: 0,
    chem: 0,
    civil: 0,
    mech: 0,
    total: 0
  }
  
  ngOnInit(): void {
    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
    this.batch = this.cur_year+1;
    this.initTable()
    this.getDeptWiseReportData()
  }

  initTable(){
    const data = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30
    ]
    this.getVisitedCompanies()
  }

  ngAfterViewInit(): void {
    
  }


  onBatchChange(selectedBatch:string){
    this.batch = parseInt(selectedBatch)
    this.getDeptWiseReportData()
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.VISITED_COMPANIES.filter = filterValue.trim().toLowerCase();
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
      this.deptWiseReportDataTotal.ctc.gt20 += (dept.ctc.gt20).length
      this.deptWiseReportDataTotal.ctc.gt15 += dept.ctc.gt15.length
      this.deptWiseReportDataTotal.ctc.gt10 += dept.ctc.gt10.length
      this.deptWiseReportDataTotal.ctc.gt8 += dept.ctc.gt8.length
      this.deptWiseReportDataTotal.ctc.gt7 += dept.ctc.gt7.length
      this.deptWiseReportDataTotal.ctc.gt6 += dept.ctc.gt6.length
      this.deptWiseReportDataTotal.ctc.gt5 += dept.ctc.gt5.length
      this.deptWiseReportDataTotal.ctc.gt4 += dept.ctc.gt4.length
      this.deptWiseReportDataTotal.ctc.lt4 += dept.ctc.lt4.length
      this.deptWiseReportDataTotal.total_percent += dept.total_percent
    })

  }

  getVisitedCompanies(){
    let user_id = this.role==='Director'?'Director':(this.userData.staff_id!)
    this.service.getVisitedCompanies(this.batch, user_id).subscribe(
      (res:getVisitedCompaniesData)=>{
        console.log(res)
        this.totalOfferData = res.total
        this.VISITED_COMPANIES = new MatTableDataSource(res.visited_companies);
        this.VISITED_COMPANIES.paginator = this.paginator;
      },
      (err:any)=>{
        this.toastr.error('Something went wrong!')
      }
    )
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

  openTable(student_lst:string[]){
    this.student_table = true
    this.studentData = student_lst
  }

  closeTable(flag:any){
    this.student_table = flag
  }


}

