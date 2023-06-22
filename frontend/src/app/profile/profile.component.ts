import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { loadMembersResponse, serverResponse, user, userByIdResponse } from '../models/model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  section = 1
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!)
  user_id = this.userData.user_id
  name = this.userData.name
  mail_id = this.userData.mail
  staff_id = this.userData.staff_id
  contact = this.userData.phone
  user_role = sessionStorage.getItem('user_role')!

  show_delete = 0
  action = 'add'
  pk = 0

  team_lst : user[] = []

  constructor(
    private service : AppService,
    private toastr : ToastrService,
    private builder : FormBuilder
  ){  }

  ngOnInit(): void {
      this.loadMembers()
  }

  loadMembers(){
    this.service.load_members().subscribe(
      (res:loadMembersResponse)=>{
        if(res.success){
          this.team_lst = res.team_lst
        }else{
          this.toastr.warning('Some Technical Error!!')
        }
        
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  addMemberForm = this.builder.group({
    
    name:this.builder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('([A-z ]+)')
    ])),
    
    mail:this.builder.control('',Validators.compose([
      Validators.required,
      Validators.email
    ])),

    staff_id:this.builder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(3)
    ])),

    contact:this.builder.control('', Validators.compose([
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern('([0-9])+')
    ])),

  });


  addMember(){
    let formData = new FormData()

    if(this.addMemberForm.valid){
      formData.append('name', this.addMemberForm.value.name!)
      formData.append('mail', this.addMemberForm.value.mail!)
      formData.append('contact', this.addMemberForm.value.contact!)
      formData.append('staff_id', this.addMemberForm.value.staff_id!)

      this.service.add_member(formData).subscribe(
        (res:serverResponse)=>{
          if(res.success){
            this.toastr.success('Member Added Successfully!!')
          }else{
            this.toastr.warning('Member Already Exists!!')
          }
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )

    }else{
      this.toastr.warning('Form Invalid!!')
    }
    
  }

  getMemberById(pk : number){
    this.service.getMemberById(pk).subscribe(
      (res:userByIdResponse)=>{
        if(res.success){
          this.action = 'edit'
          this.section = 2
          this.pk = pk
          console.log(res.user)
          this.addMemberForm.patchValue({
            name : res.user.name,
            mail : res.user.mail,
            staff_id : res.user.staff_id,
            contact : res.user.phone
          })
        }
        else this.toastr.warning('Some Technical Error!!')
        
      },
      err=>{
        this.toastr.warning('Server Not Respoding!!')
      }
    ) 
  }

  updateMember(){
    let formData = new FormData()

    if(this.addMemberForm.valid){
      formData.append('pk', this.pk.toString())
      formData.append('name', this.addMemberForm.value.name!)
      formData.append('mail', this.addMemberForm.value.mail!)
      formData.append('contact', this.addMemberForm.value.contact!)
      formData.append('staff_id', this.addMemberForm.value.staff_id!)

      this.service.update_member(formData).subscribe(
        (res:serverResponse)=>{
          if(res.success){
            this.toastr.success(res.message)
          }else{
            this.toastr.warning(res.message)
          }
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
    
    }else{
      this.toastr.warning('Form Invalid!!')
    }
    
  }

  deleteMember(pk : number){
    let data = {
      pk : pk
    }
    this.service.delete_member(data).subscribe(
      (res:serverResponse)=>{
        if(res.success){
          this.toastr.success(res.message)
          this.loadMembers()
          this.show_delete = 0
        }else{
          this.toastr.warning(res.message)
        }
      },
      err=>{
        this.toastr.warning('Form Invalid!!')
      }
    )
  }

  back(){
    this.section = 1
    this.action = 'add'
    this.loadMembers()
    this.addMemberForm.reset()
  }

}
