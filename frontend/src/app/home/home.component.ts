import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  temp:string = ""

  ngOnInit(): void {
    sessionStorage.clear()
    sessionStorage.setItem('user', 'null')
    sessionStorage.setItem('role', 'null')

    this.dataService.user_role = 'null'
    this.dataService.user_id = 'null'

  }
  constructor(
    private service:AppService,
    private dataService:DataService,
    private toastr:ToastrService,
    private router:Router){

  }

  loginAs(role:string){
    sessionStorage.setItem('role',role);
    this.dataService.user_role = role
    this.router.navigate(['login'])
  }

  submit(){

    


    // let user_id:any = (document.getElementById('user_id') as HTMLInputElement).value.toString()
    // let pass:any = (document.getElementById('pass') as HTMLInputElement).value.toString()
    // let name:any = (document.getElementById('name') as HTMLInputElement).value.toString()
    // let mail:any = (document.getElementById('mail') as HTMLInputElement).value.toString()
    // let contact:any = (document.getElementById('contact') as HTMLInputElement).value.toString()
    // let staff_id:any = (document.getElementById('staff_id') as HTMLInputElement).value.toString()



    // let formData:FormData = new FormData()
    // formData.append('user_id',user_id)
    // formData.append('pass', pass)
    // formData.append('name',name)
    // formData.append('mail', mail)
    // formData.append('contact',contact)
    // formData.append('staff_id', staff_id)

    // this.service.add_admin(formData).subscribe(
    //   (res:submitResponse)=>{
    //     this.temp = res.message!
    //   },
    //   err=>{

    //   }
    // )
  }
}
