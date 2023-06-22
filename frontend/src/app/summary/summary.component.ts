import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { reportByIdResponse, reportSummaryResponse, summaryObject } from '../models/model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  section = 1
  period_filter  = 'Today'

  tot_reports = 0
  tot_companies = 0
  active_staffs = 0

  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());

  report_summary:summaryObject[] = []

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { 

  }

  ngOnInit(): void {
    this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
    this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
    this.applyFilter(this.period_filter)
  }

  changeFilter(filter:string){
    this.period_filter = filter
    
    this.applyFilter(this.period_filter)
  }


  applyFilter(filter:string){
    
    let data = {
      start_date : this.datePipe.transform(this.startDate, 'yyyy-MM-dd')!,
      end_date : this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!,
      filter : filter
    }

    this.service.getReportSummary(data).subscribe(
      (res:reportSummaryResponse)=>{
        if(res.success){
          console.log(res.report_summary)
          this.report_summary = res.report_summary
          this.tot_reports = 0
          this.tot_companies = 0
          this.active_staffs = 0
          for(let report in this.report_summary){
            this.tot_reports+=(this.report_summary[report].total_reports)
            this.tot_companies+=(this.report_summary[report].companies.length)
            if(this.report_summary[report].total_reports>0) this.active_staffs+=1
          }
        }else this.toastr.warning('Failed to get report summary')
      },
      err=>{
        this.toastr.warning('Serveer Not Responding')
      }
    )
  }

}
