import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { getCompanyStatsResponse, getUserStatsResponse, loadMembersResponse, serverResponse, user, userByIdResponse } from '../models/model';
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
  action = 'Add'
  role = 'Member'
  title = 'My Profile'
  pk = 0

  reports_today = 0
  reports_week = 0
  reports_month = 0
  
  drives_today = 0
  drives_week = 0
  drives_month = 0

  team_lst : user[] = []
  admin_lst:user[] = []

  it_product : any[] = []
  it_service: any[] = []
  core: any[] = []
  marketing : any[] = []
  others:any[] = []

  it_product_count = 0
  it_service_count = 0
  core_count = 0
  marketing_count = 0
  others_count = 0

  constructor(
    private service : AppService,
    private toastr : ToastrService,
    private builder : FormBuilder
  ){  }

  // Both ADMIN and MEMBER can use this function
  ngOnInit(): void {
    if(this.user_role=='Director'){
      this.loadMembers('member')
      this.loadMembers('admin')
    }
    if(this.user_role=='Officer'){
      this.getUserStats()
      this.getCompanyStats()
    }
  }

  // Both ADMIN and MEMBER can use this function
  loadMembers(role:string){
    this.service.load_members(role).subscribe(
      (res:loadMembersResponse)=>{
        if(res.success){
          if(role==='member') this.team_lst = res.team_lst
          else this.admin_lst = res.team_lst
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


  // Both ADMIN and MEMBER can use this function
  addMember(){
    let formData = new FormData()

    if(this.addMemberForm.valid){
      formData.append('name', this.addMemberForm.value.name!)
      formData.append('mail', this.addMemberForm.value.mail!)
      formData.append('contact', this.addMemberForm.value.contact!)
      formData.append('staff_id', this.addMemberForm.value.staff_id!)
      formData.append('role', this.role)

      this.service.add_member(formData).subscribe(
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

  // Both ADMIN and MEMBER can use this function
  getMemberById(pk : number, role:string){

    this.service.getMemberById(pk, role).subscribe(
      (res:userByIdResponse)=>{
        if(res.success){
          
          if(role==='member') this.changeSection(2, 'Edit', 'Member')
          else this.changeSection(2, 'Edit', 'Admin')


          this.pk = pk
          //console.log(res.user)
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

  // Both ADMIN and MEMBER can use this function
  updateMember(){
    let formData = new FormData()

    if(this.addMemberForm.valid){
      formData.append('pk', this.pk.toString())
      formData.append('name', this.addMemberForm.value.name!)
      formData.append('mail', this.addMemberForm.value.mail!)
      formData.append('contact', this.addMemberForm.value.contact!)
      formData.append('staff_id', this.addMemberForm.value.staff_id!)
      formData.append('role', this.role)

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

  // Both ADMIN and MEMBER can use this function
  deleteMember(pk : number, role:string, staff_id:string){
    let data = {
      pk : pk,
      role : role
    }
    this.service.delete_member(data).subscribe(
      (res:serverResponse)=>{
        if(res.success){
          this.toastr.success(res.message)
          if(role==='admin') this.loadMembers('admin')
          if(role==='member') this.loadMembers('member')
          this.show_delete = 0
          if(staff_id===this.staff_id) this.service.logout()
        }else{
          this.toastr.warning(res.message)
        }
      },
      err=>{
        this.toastr.warning('Form Invalid!!')
      }
    )
  }

  getUserStats(){
    this.service.getUserStats(this.userData.staff_id).subscribe(
      (res:getUserStatsResponse)=>{
        if(res.success){
          this.reports_today = res.stats.reports_today
          this.reports_week = res.stats.reports_week
          this.reports_month = res.stats.reports_month
          this.drives_today = res.stats.drives_today
          this.drives_week = res.stats.drives_week
          this.drives_month = res.stats.drives_month
        }else{
          this.toastr.warning('Some Technical Error!!')
        }
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  getCompanyStats(){
    
    this.service.getCompanyStats(this.userData.staff_id).subscribe(
      (res:getCompanyStatsResponse)=>{
        if(res.success){
          this.core = res.stats.core
          this.it_product = res.stats.it_product
          this.it_service = res.stats.it_service
          this.marketing = res.stats.marketing
          this.others = res.stats.others

          this.core_count = res.stats.core.length
          this.it_product_count = res.stats.it_product.length
          this.it_service_count = res.stats.it_service.length
          this.marketing_count = res.stats.marketing.length
          this.others_count = res.stats.others.length

        }else this.toastr.warning('Some Technical Error!!')
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  changeSection(section:number, action : string, role : string){
    this.section = section
    this.action = action
    this.role = role
    this.title = action + ' ' + role
  }

  back(){
    this.section = 1
    this.action = 'Add'
    this.title = 'My Profile'

    if(this.user_role=='Director'){
      this.loadMembers('member')
      this.loadMembers('admin')
    }

    this.addMemberForm.reset()
  }

}
