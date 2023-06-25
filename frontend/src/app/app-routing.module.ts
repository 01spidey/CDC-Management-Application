import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { homeGuard } from './guard/home.guard';
import { loginGuard } from './guard/login.guard';
import { dashboardGuard } from './guard/dashboard.guard';


const routes: Routes = [
  {path : '', component:HomeComponent, }, //canActivate : [homeGuard]
  {path : 'login', component : LoginComponent, }, //canActivate : [loginGuard]
  {path:'director', component:DirectorDashboardComponent, }, //canActivate : [dashboardGuard]
  {path:'officer', component:OfficerDashboardComponent, } //canActivate : [dashboardGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
