import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { driveByIdResponse, driveByStatusResponse, filterOptions, getMembersResponse, getReportsResponse, loadMembersResponse, loginResponse, notificationResponse, openMemberResponse, reportByIdResponse, reportSummaryResponse, serverResponse } from '../models/model';
import { P } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  URL = "http://127.0.0.1:8000/";

  constructor(private http:HttpClient) {

  }

  add_admin(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/add_admin`, formData);
  }

  login(formData:FormData){
    return this.http.post<loginResponse>(`${this.URL}/login`, formData);
  }

  add_member(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/add_member`, formData);
  }

  load_members(){
    return this.http.get<loadMembersResponse>(`${this.URL}/load_members`)
  }
  
  getDriveByStatus(status: string) {
    console.log(status)
    const params = { status: status }; // Create an object with the status parameter
    return this.http.get<driveByStatusResponse>(`${this.URL}/get_drive_by_status`, { params: params });
  }

  getDriveByDateRange(formData: FormData) {
    return this.http.post<driveByStatusResponse>(`${this.URL}/get_drive_by_dateRange`, formData);
  }
  

  add_drive(formData:FormData){
    console.log(formData.get('eligible_lst'))
    return this.http.post<serverResponse>(`${this.URL}/add_drive`, formData)
  }

  delete_drive(formData:FormData){
    return this.http.post<serverResponse>(`${this.URL}/delete_drive`, formData)
  }

  getDriveById(drive_id : number){
    const params = { drive_id : drive_id }
    return this.http.get<driveByIdResponse>(`${this.URL}/get_drive_by_id`, { params : params })
  }

  edit_drive(formData:FormData){
    console.log(formData.get('eligible_lst'))
    return this.http.post<serverResponse>(`${this.URL}/update_drive`, formData)
  }

  addReport(data:object){
      return this.http.post<serverResponse>(`${this.URL}/add_report`, data)
  }

  updateReport(data:object){
    return this.http.post<serverResponse>(`${this.URL}/update_report`, data)
  }

  getReportById(report_id : number){
    const params = { report_id : report_id }
    return this.http.get<reportByIdResponse>(`${this.URL}/get_report_by_id`, { params : params })
  }

  deleteReport(formdata : FormData){
    return this.http.post<serverResponse>(`${this.URL}/delete_report`, formdata)
  }

  applyFilter(data:filterOptions){
    return this.http.post<getReportsResponse>(`${this.URL}/get_reports`, data)
  }

  getAllMembers(){
    return this.http.get<getMembersResponse>(`${this.URL}/get_members`)
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

  // get_user(user_id: string, role: string) {
  //   let params = new HttpParams()
  //     .set('user_id', user_id)
  //     .set('role', role);
  //   return this.http.get<loginResponse>(`${this.URL}/get_user_data`, { params: params });
  // }


}
