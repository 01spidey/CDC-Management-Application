import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, getCompaniesResponse, getReportsByCompanyResponse, Report } from '../models/model';
import { popup_data } from '../popup/popup.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit{
  section = 1
  companies : company[] = []
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!)
  role = sessionStorage.getItem('user_role')!
  action = 'Company Details'
  staff_id = this.userData.staff_id
  
  popup_data!:popup_data;


  company_filter = 'Active'
  cur_company : company = {
    id : 0,
    company : 'AutoDesk',
    HR_name : 'tom h',
    HR_mail : 'tomh@gmail.com',
    website : 'www.autodesk.com',
    category : 'IT - Product',
    placement_officer_id : '19KPR001'
  }

  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());
  pkey = 0

  popup = false
  reminder = false
  // rem_toggle = false
  reminder_date = ''

  report_lst : Report[] = []
  popup_message = new FormControl('',Validators.required)
  popup_date = new FormControl('',Validators.required)



  addCompanyForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    website:this.builder.control('',Validators.required),
    category : this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),
    message : this.builder.control('',Validators.required),
  });

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    if(this.section==1) this.getCompanies(this.company_filter) 
    if(this.section==3) {
      this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
      this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
      this.getReportsByCompany()
    }
  }

  applyFilter(){

  }

  handleValue(value: boolean) {
    this.popup = !value
    console.log(value)
    this.getReportsByCompany()
  }

  changeSection(section: number, action:string){
    this.section = section
    this.action = action
  }

  addCompany(){
    const formattedReminderDate = (!this.reminder)?'' : this.datePipe.transform(this.reminder_date, 'dd-MM-yyyy');
    if(this.addCompanyForm.valid){
      if(this.reminder && this.reminder_date===''){
        this.toastr.warning('Reminder Date Invalid!!')
      }else{
        let data = {
          company:this.addCompanyForm.value.company,
          website:this.addCompanyForm.value.website,
          category:this.addCompanyForm.value.category,
          hr_name:this.addCompanyForm.value.hr_name,
          hr_mail:this.addCompanyForm.value.hr_mail,
          staff_id:this.userData.staff_id,
          reminder_date : formattedReminderDate,
          message : this.addCompanyForm.value.message
        }
        this.service.addCompany(data).subscribe(
          (res)=>{
            if(res.success){
              this.toastr.success(res.message)
            }else this.toastr.warning(res.message)
          },
          err=>{
            this.toastr.error("Server Not Responding")
          }
        )
      }
      
    }else this.toastr.warning('Form Invalid!!')
    
  }

  getCompanies(filter:string){
    this.service.getCompanies(this.staff_id, this.company_filter).subscribe(
      (res:getCompaniesResponse)=>{
        if(res.success){
          console.log(res.companies)
          this.companies = res.companies
        }
        else{
          this.toastr.warning('Something went wrong')
        }
      },
      err=>{
        this.toastr.error("Server Not Responding") 
      }
    )
  }

  editCompany(){

  }

  openCompany(company : company){
    this.toastr.info(company.company)
    this.section = 3
    this.action = 'Company Details'
    this.cur_company = company
    this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
    this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
    this.getReportsByCompany()
  }

  changeFilter(category : string, val : string){
    if(category==='company'){
      this.company_filter = val
      this.getCompanies( this.company_filter)
    }
  }

  getReportsByCompany(){
    let start_date = this.datePipe.transform(this.startDate, 'yyyy-MM-dd')!;
    let end_date = this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!;
    let data = {
      start_date : start_date,
      end_date : end_date,
      staff_id : this.staff_id,
      company : this.cur_company.company
    }

    this.service.getReportsByCompany(data).subscribe(
      (res:getReportsByCompanyResponse)=>{
        // console.log(res)
        if(res.success) this.report_lst = res.reports
        else this.toastr.warning('Something went wrong')
      },
      err=>{
        this.toastr.error("Server Not Responding")
      }
    )
  }

  editReport(report : Report){

  }
  deleteReport(report : Report){

  }

  addReport(){

  }

  openPopup(as : string, report : Report){

    this.popup_data = {
      open_as : as,
      report : report
    }
    this.popup = true

    // console.log(report)
  }

  

  back(){
    this.section = 1
    this.getCompanies(this.company_filter)
  }
}
