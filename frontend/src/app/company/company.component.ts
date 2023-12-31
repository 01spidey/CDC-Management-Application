import { Component, EventEmitter, OnInit, Output,} from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, getCompaniesResponse, getReportsByCompanyResponse, Report, serverResponse } from '../models/model';
import { popup_data } from '../popup/popup.component';
import { drive_popup_data } from '../drive-popup/drive-popup.component';
import { student_table_data } from '../student-table/student-table.component';

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
  action = 'Add Company'
  staff_id = this.userData.staff_id
  remarks = ''
  
  popup_data!:popup_data;
  drive_popup_data!:drive_popup_data;
  
  company_filter = 'Active'
  cur_company! : company;

  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());
  pkey = 0

  popup = false
  reminder = false
  // rem_toggle = false
  reminder_date = ''
  lock_hr_mail = false
  lock_hr_contact = false
  delete_popup = false
  delete_report_pk = 0
  remark_report_pk = 0
  drive_popup = false
  remarks_popup = false
  

  report_lst : Report[] = []
  popup_message = new FormControl('',Validators.required)
  popup_date = new FormControl('',Validators.required)
  last_followup!:Report;
  last_followup_status! : boolean;
  

  @Output() close_section = new EventEmitter<boolean>();

  checked_students!:Set<string>;

  addCompanyForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    website:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.pattern(
        /^(https?:\/\/)?(www\.)?([a-z0-9\-]+)\.([a-z]{2,})(\.[a-z]{2,})?(\/[a-z]*)*$/i
      ),
    ])),
    category : this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),
    message : this.builder.control('',Validators.required),
    hr_contact:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.pattern("^[0-9]{10}$"),
    ]))
  });

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  

  ngOnInit(): void {
    this.action = sessionStorage.getItem('cur_action')!
    this.section = sessionStorage.getItem('cur_company_section')?Number(sessionStorage.getItem('cur_company_section')):1
    this.cur_company = JSON.parse(sessionStorage.getItem('cur_company')!)
    if(this.section==1) this.getCompanies(this.company_filter) 
    if(this.section==3) {
      this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
      this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
      this.getReportsByCompany()
    }
  }

  applyFilter(){

  }

  openRemarksPopup(report_pk : number, open_as:string){
    this.remarks_popup = true
    this.remark_report_pk = report_pk
    if(open_as==='edit') this.remarks = this.report_lst.filter(report=>report.pk===report_pk)[0].remarks
  }

  addRemarks(){
    if(this.remarks.trim().length>0){
      this.service.addRemarks(this.remark_report_pk, this.remarks).subscribe(
        (res:serverResponse)=>{
          
          if(res.success){
            this.toastr.success('Remarks Added!!')
            this.remarks_popup = false
            this.remarks = ''
            this.remark_report_pk = 0
            this.getReportsByCompany()
          }else this.toastr.warning('Some technical Error!!')
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
    }
    else{
      console.log(this.remarks)
      this.toastr.warning('Remarks cannot be empty!!')
    }
  }

  closeRemarksPopup(){
    this.remarks_popup = false
    this.remarks = ''
    this.remark_report_pk = 0
  }

  handleValue(value: boolean) {
    this.popup = value
    this.getReportsByCompany()
  }


  handleDrivePopup(value: boolean) {
    this.drive_popup = value
  }

  // handleStudentTablePopupData(value: student_table_data){
  //   this.student_table_popup_data = value
  // }

  changeSection(section: number, action:string){
    sessionStorage.setItem('cur_company_section', section.toString())
    sessionStorage.setItem('cur_action', action)
    this.section = section
    this.action = action
    if(action=='Edit Company') this.editCompany()
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
          message : this.addCompanyForm.value.message,
          hr_contact:this.addCompanyForm.value.hr_contact,
          lock_hr_mail : this.lock_hr_mail,
          lock_hr_contact : this.lock_hr_contact
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
    this.service.getCompanies(this.staff_id, this.company_filter, this.role).subscribe(
      (res:getCompaniesResponse)=>{
        if(res.success){
          //console.log(res.companies)
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
    this.addCompanyForm.patchValue({
      company:this.cur_company.company,
      website:this.cur_company.website,
      category:this.cur_company.category,
      hr_name:this.cur_company.HR_name,
      hr_mail:this.cur_company.HR_mail,
      hr_contact:this.cur_company.HR_contact,
      message : "Vanakkam Bruh!!"
    })
    this.lock_hr_mail = this.cur_company.lock_hr_mail
    this.lock_hr_contact = this.cur_company.lock_hr_contact
  }

  updateCompany(){
    if(this.addCompanyForm.valid){
      let data = {
        pk : this.cur_company.id,
        company : this.addCompanyForm.value.company,
        website : this.addCompanyForm.value.website,
        category : this.addCompanyForm.value.category,
        hr_name : this.addCompanyForm.value.hr_name,
        hr_mail : this.addCompanyForm.value.hr_mail,
        hr_contact : this.addCompanyForm.value.hr_contact,
        lock_hr_mail : this.lock_hr_mail,
        lock_hr_contact : this.lock_hr_contact
      }
      this.service.updateCompany(data).subscribe(
        (res:serverResponse)=>{
          if(res.success){
            this.toastr.success('Company Details Updated!!')
          }else this.toastr.warning(res.message)
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
    }else this.toastr.warning('Form Invalid!!')
  }

  deleteCompany(){

  }

  openCompany(company : company){
    this.section = 3
    sessionStorage.setItem('cur_company_section', this.section.toString())
    this.action = 'Company Details'
    this.cur_company = company
    this.startDate = this.datePipe.transform(this.threeMonthsAgo, 'yyyy-MM-dd')!;
    this.endDate = this.datePipe.transform(this.today, 'yyyy-MM-dd')!;
    sessionStorage.setItem('cur_company',JSON.stringify(company))
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
      staff_id : this.cur_company.placement_officer_id,
      company : this.cur_company.company
    }

    this.service.getReportsByCompany(data).subscribe(
      (res:getReportsByCompanyResponse)=>{
        //console.log('getReportsByCompanyResponse')
        if(res.success){ 
          this.report_lst = res.reports
          this.last_followup = this.report_lst[0]
          this.last_followup_status = this.last_followup.status
          console.log(res.reports)
        }
        else this.toastr.warning('Something went wrong')
      },
      err=>{
        this.toastr.error("Server Not Responding")
      }
    )
  }

  editReport(report : Report){

  }

  deleteReport(pk : number){
    let data = {
      pk : pk
    }
    this.service.deleteCompanyReport(data).subscribe(
      (res:serverResponse)=>{
        this.delete_popup = false
        if(res.success){
          this.toastr.success(res.message)
          this.getReportsByCompany()
        }else this.toastr.warning('Some technical Error!!')
      },
      err=>{
        this.toastr.warning('Server Not Responding!!')
        this.delete_popup = false
      }
    )
  }

 

  openDeletePopup(pk : number){
    this.delete_report_pk = pk
    this.delete_popup = true
  }

  openPopup(as : string, report : Report){

    this.popup_data = {
      open_as : as,
      report : report
    }
    this.popup = true

    // //console.log(report)
  }

  openDrivePopup(){
    this.drive_popup_data = {
      open_as : 'add',
      drive : null
    }
    this.drive_popup = true
  }

  trimTime(timestamp:string) : string{
    //console.log(timestamp)
    let time = timestamp.split('T')[1]
    return time.split('.')[0]
  }

  exportAsCsv(){
    let start_date = this.datePipe.transform(this.startDate, 'yyyy-MM-dd')!;
    let end_date = this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!;
    let data = {
      start_date : start_date,
      end_date : end_date,
      staff_id : this.cur_company.placement_officer_id,
      company : this.cur_company.company
    }

    this.service.exportAsCsv(data).subscribe(
      (res:any)=>{
        const blob = new Blob([res], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${this.cur_company.company}_followup_${this.userData.name}.csv`;
        downloadLink.click();
      },
      err=>{
        this.toastr.error("Server Not Responding")
      }
    )
  }

  back(){
    if(this.section===1){
      this.close_section.emit(true)
    }else{
      this.section = 1
      sessionStorage.setItem('cur_company_section', this.section.toString())    
      this.getCompanies(this.company_filter)
    }
      
  }
}
