import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  temp:string = ""

  ngOnInit(): void {
    sessionStorage.clear()
    sessionStorage.setItem('cur_page', 'home')
  }
  constructor(
    private service:AppService,
    private toastr:ToastrService,
    private router:Router){
  }

  loginAs(role:string){
    sessionStorage.setItem('cur_page', '')
    sessionStorage.setItem('user_role',role);
    this.router.navigate(['login'])
  }
}
