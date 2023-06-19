import { Component, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { DatePipe, formatDate } from '@angular/common';
import { filterOptions, getMembersResponse, getReportsResponse, serverResponse, Report } from '../models/model';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import 'ag-grid-enterprise';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';


export interface Member {
  name: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit{

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // fruits: Fruit[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  announcer = inject(LiveAnnouncer);


  section = 1

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
  
  period_filter  = 'Today'
  report_filter = 'All'
  visibility = 'Public'
  
  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());
  action = 'add'

  reminder = false
  reminder_date = ''
  date_control = new FormControl()


  member_lst:string[] = []
  all_members:string[] = []

  row_data:any[] = []

  col_defs : ColDef[] = [
    {field : 'date',
    filter: 'agDateColumnFilter'},

    {field : 'staff_id'},

    {field : 'company'},
    
    {field : 'HR_name'},
    
    {field : 'HR_mail'},
    
    {field : 'message'},

    {field : 'contact_mode'},
    
    {
      headerName: 'Edit',
      cellRenderer: 'editButtonRenderer',
      width: 100,
    },
    {
      headerName: 'Delete',
      cellRenderer: 'deleteButtonRenderer',
      width: 100,
    }
  ]

  defaultColDef: ColDef = {
    editable: true,
    sortable: true,
    // filter: 'agTextColumnFilter',
    cellStyle: { 'font-size': '15px','font-family':'Nunito', 'white-space': 'normal' },
    filter: 'agSetColumnFilter',
    menuTabs: ['filterMenuTab'],
    resizable: true,
    minWidth: 130,
    autoHeight: true
  };

  gridOptions = {
    columnDefs: this.col_defs,
    defaultColDef: {
      // checkboxSelection: true,
    },
  };

  private gridApi!: GridApi;
  

  addReportForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    date:this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),
    message:this.builder.control('',Validators.required),
    mode : this.builder.control('',Validators.required),
  });

  

  ngOnInit(): void {
      this.reminder = false
      
      this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
      this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;

      this.applyFilter()
  }

  constructor(
    private service : AppService,
    private dataService : DataService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { 

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (this.all_members.includes(value) && value!== this.userData.staff_id) {
      // console.log(typeof(value))
      this.member_lst.push(value);
    }

    event.chipInput!.clear();
  }

  remove(member: string): void {
    const index = this.member_lst.indexOf(member);

    if (index >= 0) {
      this.member_lst.splice(index, 1);

      this.announcer.announce(`Removed ${member}`);
    }
  }

  edit(member: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(member);
      return;
    }

    // Edit existing fruit
    const index = this.member_lst.indexOf(member);
    if (index >= 0) {
      this.member_lst[index] = value;
    }
  }

  changeSection(section:number){
    this.section = section
    this.visibility = 'Public'
    this.service.getAllMembers().subscribe(
      (res:getMembersResponse)=>{
        if(res.success){
          this.all_members = res.members
          console.log(this.all_members)
        }else{
          this.toastr.warning('Some Technical Error!!')
        }
      },
      err=>{
        this.toastr.error('Server Not Responding!!')
      }
    )

  }

  addReport(){
    
    if(this.reminder_date==='') console.log(this.reminder_date)

    if(this.addReportForm.valid){      
      if(this.reminder && this.reminder_date===''){
        this.toastr.warning('Set reminder date!!')
      }else{
        const formattedDate = this.datePipe.transform(this.addReportForm.value.date!, 'dd-MM-yyyy');
        const formattedReminderDate = (!this.reminder)?'' : this.datePipe.transform(this.reminder_date, 'dd-MM-yyyy');
        // console.log(formattedDate+' '+formattedReminderDate)
        
        let data = {
          company:this.addReportForm.value.company,
          date:formattedDate,
          hr_name:this.addReportForm.value.hr_name,
          hr_mail:this.addReportForm.value.hr_mail,
          message:this.addReportForm.value.message,
          mode : this.addReportForm.value.mode,
          visibility : this.visibility,
          reminder_date : formattedReminderDate,
          staff_id : this.userData.user_id,
          visible_to : this.member_lst
        }

        console.log(data)

        // let data = this.addReportForm.value

        this.service.addReport(data).subscribe(
          (res:serverResponse)=>{
            if(res.success){
              this.toastr.success('Report added successfully')
              this.reminder = false
            }else{
              this.toastr.warning('Something went wrong')
            }
          },
          (err)=>{
            this.toastr.error('Something went wrong')
          }
        )
      }
      
    }else this.toastr.warning('Form Invalid!!')
    

  }

  editReport(){

  }

  deleteReport(){

  }

  resetForm(){

  }

  applyFilter(){
      if(this.report_filter==='All') this.visibility=''
      if(this.period_filter==='Today'){
        this.startDate = ''
        this.endDate = ''
      }
      console.log(`Category : ${this.report_filter}\nPeriod : ${this.period_filter}\nVisibility : ${this.visibility}\nDate Range : ${this.startDate}   ${this.endDate}`)
      
      const startDate = this.startDate ? formatDate(this.startDate, 'yyyy-MM-dd', 'en') : '';
      const endDate = this.endDate ? formatDate(this.endDate, 'yyyy-MM-dd', 'en') : '';

      let data:filterOptions = {
        category : this.report_filter,
        period : this.period_filter,
        startDate : startDate,
        endDate : endDate,
        visibility : this.visibility,
        staff_id : this.userData.staff_id
      }

      this.service.applyFilter(data).subscribe(
        (res:getReportsResponse)=>{
          if(res.success){
            this.row_data = res.reports
            console.log(this.row_data)        
            
          }else this.toastr.warning('Some Technical Error!!')
        },
        err=>{
          this.toastr.error('Server Not Responding!!')
        }
      )
    

  }

  changeFilter(category : string, value:string){
    if(category==='report'){ 
      this.report_filter=value
      this.visibility = 'Public'
    }
    else if(category==='period'){ 
      this.period_filter=value
      if(value==='Custom'){
        this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
        this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
      }
    }
    else this.visibility=value

    this.applyFilter()
  }

  onBtnExport(){
    this.gridApi.exportDataAsCsv();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }



}
