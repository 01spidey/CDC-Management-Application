import { Component, OnInit, ViewChild } from '@angular/core';
import { loadMembersResponse, user, openMemberResponse, serverResponse } from '../models/model';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit{

  section = 1
  
  team_lst:user[] = [ ]

  cur_member:user = {
    user_id : "",
    name : "",
    mail : "",
    phone : "",
    staff_id : ""
  }

  report_lst = [1,2,3,4,5]

  panelOpenState = false;


  ngOnInit(): void {
      this.loadMembers()
  }

  ELEMENT_DATA: any[] = [
    {position : 1, panel : {
      date: '15-06-2023',
      placement_officer_id: '19KPR001',
      company: 'Flipkart',
      website: 'www.flipkart.com', 
      HR_name: 'Mr. Goodwill',
      HR_mail: 'goodwill@flipkartHR.com',
      contact_mode: 'Google Meet',
      message: 'Talked about recruitment criteria',
      reminder_date: '20-06-2023'
    }},
    {position : 2, panel : {
      date: '16-06-2023',
      placement_officer_id: '19KPR001',
      company: 'Amazon',
      website: 'www.flipkart.com', 
      HR_name: 'Mr. Goodwill',
      HR_mail: 'goodwill@flipkartHR.com',
      contact_mode: 'Google Meet',
      message: 'Talked about recruitment criteria',
      reminder_date: '20-06-2023'
    }},
  ];

  displayedColumns: string[] = ['position','panel'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private builder:FormBuilder,
    private toastr:ToastrService,
    private service:AppService
  ) { }

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
            this.addMemberForm.reset()
            this.loadMembers()
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

  loadMembers(){
    this.service.load_members().subscribe(
      (res:loadMembersResponse)=>{
        this.team_lst = res.team_lst
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')

      }
    )
  }

  openMember(user_id:string, name:string, mail:string, contact:string, staff_id:string){
    this.section = 3
    this.toastr.info(user_id)

    this.cur_member.user_id = user_id
    this.cur_member.name = name
    this.cur_member.mail = mail
    this.cur_member.phone = contact
    this.cur_member.staff_id = staff_id

  }


  resetForm(){
    this.addMemberForm.reset() 
  }
}
