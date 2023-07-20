import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { companyByIdResponse, driveByIdResponse, driveByStatusResponse, filterOptions, getChartsDataResponse, getCompaniesResponse, getCompanyStatsResponse, getMembersResponse, getReportsByCompanyResponse, getReportsResponse, getUserStatsResponse, loadMembersResponse, loginResponse, notificationResponse, openMemberResponse, placementStats, placementStatsResponse, reportByIdResponse, reportSummaryResponse, sendOTPResponse, serverResponse, studentTableFilterOptions, studentTableFilterResponse, user, userByIdResponse } from '../models/model';
import { Router } from '@angular/router';
import { categoryStats } from '../dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
 
  URL = "http://127.0.0.1:8000";
  // URL = "https://b0ad-123-63-135-33.ngrok-free.app"

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
  
  getCompanies(staff_id : string, filter : string, role:string){
    const params = {
      staff_id : staff_id,
      filter : filter,
      role : role
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

  exportAsCsv(data:any){
    const options = { responseType: 'blob' as 'json' };
    return this.http.post<any>(`${this.URL}/export_as_csv`, data, options)
  }

  exportStudentDataAsCsv(data : {drive_id : number, round : number}){
    const params = {
      drive_id : data.drive_id,
      round : data.round
    }

    const options = { 
      responseType: 'blob' as 'json',
      params : params
    };
    
    return this.http.get<any>(`${this.URL}/export_as_csv`, options)
  }

  // ---------------------------------------------------------------------------

  getEligibleStudents(filters:studentTableFilterOptions){
    // console.error(filters)
    return this.http.post<studentTableFilterResponse>(`${this.URL}/get_eligible_students`, filters)
  }

  onlySelected(checked_students:Set<string>, round:number, drive_id:number){
    let arr = Array.from(checked_students)
    const params = { checked_students : arr.join(','), cur_round : round , drive_id : drive_id}
    return this.http.get<studentTableFilterResponse>(`${this.URL}/get_eligible_students`, {params : params})
  }

  publishDriveMail(id: number) {
    const params = { id: id };
    return this.http.get<serverResponse>(`${this.URL}/publish_drive_mail`, { params: params });
  }

  getPlacementStats(data:any){
    return this.http.get<placementStatsResponse>(`${this.URL}/get_placement_stats`, {params : data})
  }

  getCompanyCategoryStats(data:any){
    return this.http.get<{
      success : boolean,
      stats : categoryStats[]
    }>(`${this.URL}/get_company_category_stats`, {params : data})
  }

  getChartsData(data:any){
    return this.http.get<getChartsDataResponse>(`${this.URL}/get_charts_data`, {params : data})
  }


}
