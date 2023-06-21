import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { DataService } from '../service/data.service';
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

      this.applyFilter(this.period_filter)
  }


  applyFilter(filter:string){


  }

}
