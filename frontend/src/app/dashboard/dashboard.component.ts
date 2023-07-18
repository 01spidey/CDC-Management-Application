import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { placementStats, placementStatsResponse, reportSummaryResponse, summaryObject } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, FormControlName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export interface categoryStats{
  name:string,
  tot_offers:number,
  avg_ctc:number,
  max_ctc:number,
  color?:string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {


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
  category_lst:categoryStats[] = []

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

  placement_stats! : placementStats;
  private dept_chart!: any;
  private ctc_chart!: any;
  private gender_chart!:any;
  private overall_chart!:any;

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }


  ngAfterViewInit(): void {
    this.initializeCharts('dept_chart');  
  }

  ngOnInit(): void {
    
    this.placement_stats = {
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

    
    // this.initializeCharts('ctc_chart');
    // this.initializeCharts('cgpa_chart');
    // this.initializeCharts('gender_chart');

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
    .add(()=>{
      this.service.getCompanyCategoryStats(data).subscribe(
        (res:{
          success:boolean, 
          stats:categoryStats[]
        })=>{
            if(res.success){
              this.category_lst = res.stats
              console.log(res.stats)
            }
            else this.toastr.error('Error', 'Error')
          },
          (err)=>{
            this.toastr.error(err.error.message, 'Error')
          }
        )
      },
    )
  }

  onBatchChange(selectedBatch:string){
    this.batch_indi = parseInt(selectedBatch)
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  initializeCharts(chart:string){
    
    this.dept_chart = new Chart('dept_bar_chart', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
  }

}

