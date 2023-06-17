import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';
import {  loginResponse, serverResponse } from '../models/model';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  role:string = ""
  
  loginForm = this.builder.group({
    user_id:this.builder.control('', Validators.required),
    password:this.builder.control('', Validators.required),
  })

  ngOnInit(): void {
      this.role = this.dataService.user_role
  }

  constructor(
    private builder:FormBuilder, 
    private toastr:ToastrService,
    private service:AppService,
    private dataService:DataService,
    private router:Router
  ){

  }

  proceedLogin(){

    let formData = new FormData();
    if(this.loginForm.valid){
      formData.append('user_id', this.loginForm.value.user_id!)
      formData.append('pass', this.loginForm.value.password!)
      formData.append('role', this.role)
      
      this.service.login(formData).subscribe(
        (res:loginResponse)=>{
          if(res.success){
            this.toastr.success(res.message)
            this.dataService.user_id = this.loginForm.value.user_id!
            this.dataService.cur_user_data = res.user_data
            
            console.log(this.dataService.cur_user_data)

            if(this.role=='Director'){
              this.router.navigate(['director'])
            }else{
              this.router.navigate(['officer'])
            }
          }else{
            this.toastr.warning(res.message)
          }
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
      
    }else{
      this.toastr.error('Form Invalid!!')
    }
  }
}
