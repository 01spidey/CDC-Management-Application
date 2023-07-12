import { Component, OnInit } from '@angular/core';
import { placementStats, reportSummaryResponse, summaryObject } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, FormControlName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { range } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  section = 1
  
  status_filter = 'Overall'
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

  batch_indi:number = 0
  cur_year = 0
  batch_lst:number[] = []
  start_year = 0
  end_year = 0

  placement_stats : placementStats = {
    placed_students: [],
    package: {
      max: 0,
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
      placed_students: [180, 250],
      package: {
        max: 21,
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

    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+2; i++) this.batch_lst.push(i);
    this.batch_indi = this.cur_year;

    this.start_year = this.cur_year-10
    this.end_year = this.cur_year+2
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  changeFilter(status_filter:string, job_type_filter:string){
    this.status_filter = status_filter
    this.job_type_filter = job_type_filter
    
    this.applyFilter(this.status_filter, job_type_filter)
  }

  applyFilter(status_filter:string, job_type_filter:string){
    
  }

}
