import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { driveByStatusResponse, loadMembersResponse, loginResponse, openMemberResponse, serverResponse } from '../models/model';

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

  // get_user(user_id: string, role: string) {
  //   let params = new HttpParams()
  //     .set('user_id', user_id)
  //     .set('role', role);
  //   return this.http.get<loginResponse>(`${this.URL}/get_user_data`, { params: params });
  // }


}
