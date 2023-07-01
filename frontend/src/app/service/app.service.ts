import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { companyByIdResponse, driveByIdResponse, driveByStatusResponse, filterOptions, getCompaniesResponse, getCompanyStatsResponse, getMembersResponse, getReportsByCompanyResponse, getReportsResponse, getUserStatsResponse, loadMembersResponse, loginResponse, notificationResponse, openMemberResponse, reportByIdResponse, reportSummaryResponse, sendOTPResponse, serverResponse, user, userByIdResponse } from '../models/model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  URL = "http://127.0.0.1:8000";

  constructor(
    private http:HttpClient,
    private router:Router) {

  }

  add_admin(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/add_admin`, formData);
  }

  login(formData:FormData){
    return this.http.post<loginResponse>(`${this.URL}/login`, formData);
  }

  // Both ADMIN and MEMBER can use this function
  add_member(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/add_member`, formData);
  }

  // Both ADMIN and MEMBER can use this function
  update_member(data:FormData){
    return this.http.post<serverResponse>(`${this.URL}/update_member`, data);
  }

  // Both ADMIN and MEMBER can use this function
  delete_member(data : object){
    return this.http.post<serverResponse>(`${this.URL}/delete_member`, data);
  }

  // Both ADMIN and MEMBER can use this function
  load_members(role:string){
    let params = {role : ''}
    if(role==='admin') params = {role : 'admin'}
    else params = {role : 'member'}
    
    return this.http.get<loadMembersResponse>(`${this.URL}/load_members`, {params : params})
  }

  // Both ADMIN and MEMBER can use this function
  getMemberById(pk:number, role:string){
    const data = {pk : pk, role:role}
    return this.http.get<userByIdResponse>(`${this.URL}/get_member_by_id`, {params : data})
  }
  
  getDriveByStatus(status: string) {
    console.log(status)
    const params = { status: status }; // Create an object with the status parameter
    return this.http.get<driveByStatusResponse>(`${this.URL}/get_drive_by_status`, { params: params });
  }

  getDriveByDateRange(formData: FormData) {
    return this.http.post<driveByStatusResponse>(`${this.URL}/get_drive_by_dateRange`, formData);
  }

  delete_drive(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/delete_drive`, formData)
  }

  getReportSummary(data:object){
    return this.http.post<reportSummaryResponse>(`${this.URL}/get_report_summary`, data)
  }

  getNotifications(cat : string, staff_id : string){
    const data = {
      category : cat,
      staff_id : staff_id
    }
    return this.http.get<notificationResponse>(`${this.URL}/get_notifications`, {params : data})
  }

  getUserStats(staff_id : string){
    const data = {
      staff_id : staff_id
    }
    return this.http.get<getUserStatsResponse>(`${this.URL}/get_user_stats`, {params : data})
  }

  logout(){
    this.router.navigate([''])
  }

  sendOTP(data:object){
    return this.http.post<sendOTPResponse>(`${this.URL}/send_otp`, data)
  }

  updateCredentials(data:object){
    return this.http.post<serverResponse>(`${this.URL}/update_credentials`, data)
  }

  getCompanyStats(staff_id : string){
    const params = {
      staff_id : staff_id
    }
    return this.http.get<getCompanyStatsResponse>(`${this.URL}/get_company_stats`, {params : params})
  }



  // ------------------------------------------------------------------------------------

  addCompany(data:object){
    return this.http.post<serverResponse>(`${this.URL}/add_company`, data)
  }

  deleteCompany(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/delete_company`, formData)
  }

  getCompanyById(company : number){
    const params = { company : company }
    return this.http.get<companyByIdResponse>(`${this.URL}/get_company_by_id`, { params : params })
  }
  
  getCompanies(staff_id : string, filter : string){
    const params = {
      staff_id : staff_id,
      filter : filter
    }
    return this.http.get<getCompaniesResponse>(`${this.URL}/get_companies`, {params : params})
  }

  getReports(data:any){
    return this.http.get<getReportsResponse>(`${this.URL}/get_reports`, {params : data})
  }


  getReportsByCompany(data:any){
    return this.http.get<getReportsByCompanyResponse>(`${this.URL}/get_reports_by_company`, {params : data})
  }

  addAndUpdateCompanyReport(data:object){
    return this.http.post<serverResponse>(`${this.URL}/add_and_update_company_report`, data)
  }

  updateCompany(data:any){
    return this.http.post<serverResponse>(`${this.URL}/update_company`, data)
  }

  deleteCompanyReport(data:any){
    return this.http.post<serverResponse>(`${this.URL}/delete_company_report`, data)
  }

  addCompanyDrive(data:FormData, action:string){
    return this.http.post<serverResponse>(`${this.URL}/add_and_update_company_drive`, data)
  }


}
