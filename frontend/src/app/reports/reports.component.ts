import { Component, OnInit, ViewChild, inject, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { DatePipe, formatDate } from '@angular/common';
import { filterOptions, getMembersResponse, getReportsResponse, serverResponse, Report, reportByIdResponse } from '../models/model';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

import {EditButtonComponent} from '../buttonRenders/edit-button/edit-button.component'
// import{DeleteButtonRenderer} from '../buttonRenders/DeleteButtonRenderer.component'

import 'ag-grid-enterprise';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { DeleteButtonComponent } from '../buttonRenders/delete-button/delete-button.component';


export interface Member {
  name: string;
}


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'], 
})

export class ReportsComponent implements OnInit{

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // fruits: Fruit[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  announcer = inject(LiveAnnouncer);


  section = 1

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);
 
  searchText!: string;
  period_filter  = 'Today'
  report_filter = 'All'
  visibility = 'All'
  vis_toggle = 'Public'
  vis_toggle_data = false
  
  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());
  action = 'add'
  pkey = 0

  reminder = false
  // rem_toggle = false
  reminder_date = ''
  date_control = new FormControl()


  member_lst:string[] = []
  all_members:string[] = []

  row_data:any[] = []

  col_defs : ColDef[] = [
    {field : 'company'},

    {field : 'date', filter: 'agDateColumnFilter'},

    {field : 'staff_id'},

    {field : 'HR_name'},
    
    {field : 'HR_mail'},

    {field : 'contact_mode'},

    {field : 'message'},
    
    {
      headerName: 'Edit',
      cellRenderer: EditButtonComponent,
      cellRendererParams: {
        staff_id: this.userData.staff_id,
      },
      width: 100,
    },
    {
      headerName: 'Delete',
      cellRenderer: DeleteButtonComponent,
      cellRendererParams: {
        staff_id: this.userData.staff_id,
      },
      width: 100,
    }
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
    this.vis_toggle = 'Public'
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
          visibility : this.vis_toggle,
          reminder_date : formattedReminderDate,
          staff_id : this.userData.user_id,
          visible_to : this.member_lst,
        }

        console.log(data)

        // let data = this.addReportForm.value

        this.service.addReport(data).subscribe(
          (res:serverResponse)=>{
            if(res.success){
              this.toastr.success(res.message)
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

  editReport(pk : number){
    this.section = 2
    this.vis_toggle = 'Public'
    this.action = 'edit'
    this.pkey = pk
    this.service.getReportById(pk).subscribe(
      (res:reportByIdResponse)=>{
        if(res.success){
          let report = res.report
          this.addReportForm.patchValue({
            'date' : report.date,
            'company' : report.company,
            'hr_name' : report.HR_name,
            'hr_mail' : report.HR_mail,
            'mode' : report.contact_mode,
            'message' : report.message,
          })
          this.vis_toggle = report.visibility
          this.reminder_date = report.reminder_date
          this.reminder = this.reminder_date.length>0?true:false
          this.vis_toggle_data = report.visibility==='Public'?false:true
          this.member_lst = report.visible_to

        }else{
          this.toastr.error('Some Technical Error!!')
        }
        
      },
      err=>{ this.toastr.error('Server Not Responding!!') }
    )


  }

  updateReport(){
    const formattedDate = this.datePipe.transform(this.addReportForm.value.date!, 'dd-MM-yyyy');
    const formattedReminderDate = (!this.reminder)?'' : this.datePipe.transform(this.reminder_date, 'dd-MM-yyyy');
        // console.log(formattedDate+' '+formattedReminderDate)
    console.log(this.action)
    let data = {
      pk : this.pkey,
      company:this.addReportForm.value.company,
      date:formattedDate,
      hr_name:this.addReportForm.value.hr_name,
      hr_mail:this.addReportForm.value.hr_mail,
      message:this.addReportForm.value.message,
      mode : this.addReportForm.value.mode,
      visibility : this.vis_toggle,
      reminder_date : formattedReminderDate,
      staff_id : this.userData.user_id,
      visible_to : this.member_lst,
    }

    this.service.updateReport(data).subscribe(
      (res:serverResponse)=>{
        if(res.success){
          this.toastr.success(res.message)
          this.reminder = false
        }else{
          this.toastr.warning('Something went wrong')
        }
      },
      (err)=>{
        this.toastr.error('Server Not Responding!!')
      }
    )
  }


  deleteReport(pk:number){
    let data:FormData = new FormData()
    data.append('pk', pk.toString())
    this.service.deleteReport(data).subscribe(
      (res:serverResponse)=>{
        if(res.success){ 
          this.toastr.success(res.message)
          this.applyFilter()
        }
        else this.toastr.warning(res.message)
      },
      err=>{
        this.toastr.error('Server Not Responding!!')
      }
    )
  }

  resetForm(){
    this.addReportForm.reset()
    this.vis_toggle = 'Public'
    this.reminder_date = ''
    this.reminder = false
    this.vis_toggle_data = false
    this.member_lst = []

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
      this.visibility = 'All'
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

  onBtnExport() {
    const params = {
      skipHeader: false,
      skipFooters: true,
      skipGroups: true,
      skipFloatingTop: true,
      skipFloatingBottom: true,
      allColumns: false,
      onlySelected: false,
      columnKeys: ['company', 'date', 'staff_id', 'HR_name', 'HR_mail', 'contact_mode', 'message']
    };
  
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  back(){
    this.section = 1
    this.addReportForm.reset()
    this.member_lst = []
    this.vis_toggle = 'Public'
    this.reminder_date = ''
    this.reminder = false
    this.vis_toggle_data = false
    // this.member_lst 

    this.applyFilter()
  }



}