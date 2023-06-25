import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';
import {  loginResponse, sendOTPResponse, serverResponse } from '../models/model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxOtpInputConfig } from 'ngx-otp-input/public-api';
import { loginGuard } from '../guard/login.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  role:string = ""
  section = 1
  sent = false
  can_verify = false
  user_otp = ''
  gen_otp = ''
  message = ''

  staff_id = ''
  mail_id = ''
  cur_user_id = ''
  cur_user_pass = ''

  loginForm = this.builder.group({
    user_id:this.builder.control('', Validators.required),
    password:this.builder.control('', Validators.required),
  })

  resetCredentialsForm = this.builder.group({
    staff_id:this.builder.control('', Validators.required),
    mail_id:this.builder.control('', Validators.required),
  })

  ngOnInit(): void {
      this.role = sessionStorage.getItem('user_role')!
  }

  constructor(
    private builder:FormBuilder, 
    private toastr:ToastrService,
    private service:AppService,
    private router:Router,
    private location: Location,
  ){

  }

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: true,
    classList : {
      inputBox : 'my-duper-box-class',
      input : 'my-super-class',
      inputFilled : 'my-super-filled-class',
      inputDisabled : 'my-super-disable-class',
      inputSuccess : 'my-super-success-class',
      inputError : 'my-super-error-class'
    }
  }

  handleOtpChange(event:string[]) : void{
    console.log(event)
    this.can_verify = false
    this.user_otp = event.join('')
  }

  handleOtpFill(event:string) : void{
    this.can_verify = true
    this.user_otp = event
  }

  updateCredentials(){
    if(this.loginForm.valid){
      let data = {
        staff_id : this.staff_id,
        mail_id : this.mail_id,
        user_id : this.loginForm.value.user_id,
        password : this.loginForm.value.password,
      }

      // this.service.updateCredentisla(data).subscribe(

      // )

    }else{
      this.toastr.error('Form Invalid!!')
    }
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

  triggerOTP(action:string){
    
    if(this.resetCredentialsForm.valid){
      
      let data = {
        staff_id:this.resetCredentialsForm.value.staff_id,
        mail_id:this.resetCredentialsForm.value.mail_id,
        role: sessionStorage.getItem('user_role')
      }

      this.staff_id = this.resetCredentialsForm.value.staff_id!
      this.mail_id = this.resetCredentialsForm.value.mail_id!

      this.service.sendOTP(data).subscribe(
        (res:sendOTPResponse)=>{
          if(res.success){
            this.sent = true
            this.toastr.success(res.otp)
            this.message = 'An OTP has been Sent to your mail.'
            this.gen_otp = res.otp
            this.cur_user_id = res.user_id
            this.cur_user_pass = res.password
            console.log(res)
            
          }else{
            this.toastr.warning('Some Technical Error Occured!!')
          }
        }
      )
    }
  }

  verifyOTP(){
    if(this.gen_otp==this.user_otp){
      this.section = 3
      this.message = 'Enter Your New Credentials.'
      this.loginForm.patchValue({
        user_id:this.cur_user_id,
        password:this.cur_user_pass
      })
      this.toastr.success('OTP Verified')
    }
  }

  startReset(){
    this.section = 2
    this.loginForm.reset()
  }

  goBack(){
    sessionStorage.clear()
    if(this.section==1){
      this.location.back()
    }
    else if(this.section==2){ 
      if(!this.sent) this.section = 1
      else this.sent = false
    }
    else if(this.section==3){
      this.section = 1
      this.loginForm.reset()
      this.sent = false
    }
  }
}
