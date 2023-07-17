import { Component, OnInit } from '@angular/core';
import { placementStats, placementStatsResponse, reportSummaryResponse, summaryObject } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, FormControlName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  section = 1
  
  status_filter = 'Batch'
  job_type_filter = 'All'

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  tot_reports = 0
  tot_companies = 0
  active_staffs = 0

  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());

  report_summary:summaryObject[] = []
  category_lst:{
    name:string,
    tot_offers:number,
    avg_ctc:number,
    max_ctc:number,
    color?:string
  }[] = []

  batch_indi:number = 0
  cur_year = 0
  batch_lst:number[] = []
  start_year = 0
  end_year = 0

  charts : {
    dept_chart : boolean,
    ctc_chart : boolean,
    gender_chart : boolean,
    cgpa_chart : boolean ,
    overall_chart : boolean
  } = {
    dept_chart: true,
    ctc_chart: true,
    gender_chart: true,
    cgpa_chart: true,
    overall_chart: true
  }

  placement_stats : placementStats = {
    placed_students: [],
    package: {
      max: 0,
      max_count : 0,
      avg: 0,
      median: 0,
      mode: 0
    },
    offers: {
      total: 0,
      multi_offers: 0
    },
    companies: {
      total: 0,
      offered: 0
    },
    drives: {
      total: 0,
      offered: 0
    }
  }

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    
    this.placement_stats = {
      placed_students: [173, 250],
      package: {
        max: 21,
        max_count : 2,
        avg: 7.75,
        median: 8,
        mode: 10
      },
      offers: {
        total: 106,
        multi_offers: 21
      },
      companies: {
        total: 29,
        offered: 38
      },
      drives: {
        total: 10,
        offered: 5
      } 
    }

    this.category_lst = [
    {
      name: 'IT - Product',
      tot_offers: 10,
      avg_ctc: 15,
      max_ctc: 30,
      color: '#fb840c'
    },
    {
      name: 'IT - Service',
      tot_offers: 20,
      avg_ctc: 10,
      max_ctc: 15,
      color: '#873e34ff'
    },
    {
      name: 'Core',
      tot_offers: 30,
      avg_ctc: 5,
      max_ctc: 27.5,
      color: '#fa0001'
    },
    {
      name: 'Marketing',
      tot_offers: 40,
      avg_ctc: 20,
      max_ctc: 10,
      color: '#2dd8bb'
    },
    {
      name: 'Others',
      tot_offers: 50,
      avg_ctc: 25,
      max_ctc: 7,
      color: '#3b8dfe'
    }]

    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
    this.batch_indi = this.cur_year+1;

    this.start_year = this.cur_year-10
    this.end_year = this.cur_year+5
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  changeFilter(status_filter:string, job_type_filter:string){
    this.status_filter = status_filter
    this.job_type_filter = job_type_filter
    
    this.applyFilter(this.status_filter, job_type_filter)
  }

  applyFilter(status_filter:string, job_type_filter:string){
    console.log(status_filter, job_type_filter, this.batch_indi)
    
    let data = {
      status_filter: status_filter,
      job_type_filter: job_type_filter,
      start_year: this.start_year,
      end_year: this.end_year,
      batch : this.batch_indi
    }

    this.service.getPlacementStats(data).subscribe(
      (res:placementStatsResponse)=>{
        console.log(res)
        this.placement_stats = res.stats
      },
      (err)=>{
        this.toastr.error(err.error.message, 'Error')
      }
    )

    // this.service.getReportSummary(data).subscribe((res:reportSummaryResponse)=>{

    // }).add(()=>{
    //   this.service.getPlacementStats(data).subscribe((res:placementStats)=>{
    //     this.placement_stats = res
    //   })
    // })
  }

  onBatchChange(selectedBatch:string){
    this.batch_indi = parseInt(selectedBatch)
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

}
