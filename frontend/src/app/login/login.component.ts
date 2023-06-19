import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';
import {  loginResponse, serverResponse } from '../models/model';
import { Router } from '@angular/router';


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
      this.role = sessionStorage.getItem('user_role')!
  }

  constructor(
    private builder:FormBuilder, 
    private toastr:ToastrService,
    private service:AppService,
    private router:Router
  ){

  }

  proceedLogin(){

    let formData = new FormData();
    if(this.loginForm.valid){
      formData.append('user_id', this.loginForm.value.user_id!)
      formData.append('pass', this.loginForm.value.password!)
      formData.append('user_role', this.role)
      
      this.service.login(formData).subscribe(
        (res:loginResponse)=>{
          if(res.success){
            this.toastr.success(res.message)
            sessionStorage.setItem('user_id', this.loginForm.value.user_id!)
            sessionStorage.setItem('cur_user_data', JSON.stringify(res.user_data))
            
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
