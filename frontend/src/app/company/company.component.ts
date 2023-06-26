import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { company, getCompaniesResponse } from '../models/model';

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

  addCompanyForm = this.builder.group({
    company:this.builder.control('',Validators.required),
    website:this.builder.control('',Validators.required),
    category : this.builder.control('',Validators.required),
    hr_name:this.builder.control('',Validators.required),
    hr_mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ]))
  });

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    if(this.section==1) this.getCompanies()  
  }

  applyFilter(){

  }

  changeSection(section: number, action:string){
    this.section = section
    this.action = action
  }

  addCompany(){
    let data = {
      company:this.addCompanyForm.value.company,
      website:this.addCompanyForm.value.website,
      category:this.addCompanyForm.value.category,
      hr_name:this.addCompanyForm.value.hr_name,
      hr_mail:this.addCompanyForm.value.hr_mail,
      staff_id:this.userData.staff_id
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

  getCompanies(){
    this.service.getCompanies(this.staff_id).subscribe(
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

  back(){
    this.section = 1
    this.getCompanies()
  }
}
