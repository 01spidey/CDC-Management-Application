import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { getReportsResponse, reportByIdResponse, reportSummaryResponse, summaryObject } from '../models/model';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { filter } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  section = 2
  period_filter  = 'Today'
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

  row_data:any[] = []

  col_defs : ColDef[] = [
    {field : 'company'},

    {field : 'date', filter: 'agDateColumnFilter'},

    {field : 'staff_id'},

    {field : 'HR_name'},
    
    {field : 'HR_mail'},

    {field : 'contact_mode'},

    {field : 'message'},

    {field : 'visibility'},
  ]

  defaultColDef: ColDef = {
    sortable: true,
    cellStyle: { 'font-size': '15px','font-family':'Nunito', 'white-space': 'normal' },
    filter: 'agSetColumnFilter',
    menuTabs: ['filterMenuTab'],
    resizable: true,
    minWidth: 130,
    autoHeight: true,
    // enableRowGroup: true,
    // rowGroup: true,
  };

  gridOptions = {
    columnDefs: this.col_defs,
    defaultColDef: {
      // checkboxSelection: true,
    },
  };

  private gridApi!: GridApi;

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

    if(this.section==1){
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
    else{
      this.service.getReports(data).subscribe(
        (res:getReportsResponse)=>{
          if(res.success){
            this.row_data = res.reports
            console.log(this.row_data)
          }else this.toastr.warning('Failed to get reports')
        },
        err=>{
          this.toastr.warning('Serveer Not Responding')
        }
      )
    }
  }


  onBtnExport() {
    const params = {
      skipHeader: false,
      skipFooters: true,
      skipGroups: true,
      skipFloatingTop: true,
      skipFloatingBottom: true,
      allColumns: false,
      onlySelected: false,
      columnKeys: ['company', 'date', 'staff_id', 'HR_name', 'HR_mail', 'contact_mode', 'message', 'visibility']
    };
  
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  back(){
    this.section = 1
    this.applyFilter(this.period_filter)
  }

  goto(section:number){
    this.section = section
    this.applyFilter(this.period_filter)
  }

}
