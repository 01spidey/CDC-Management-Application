import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { LoginGuard } from './guard/login.guard';
import { HomeGuard } from './guard/home.guard';
import { DirectorGuard } from './guard/director.guard';
import { OfficerGuard } from './guard/officer.guard';


const routes: Routes = [
  {path : '', component:HomeComponent,canActivate : [HomeGuard] },
  {path : 'login', component : LoginComponent, canActivate : [LoginGuard]},
  {path:'director', component:DirectorDashboardComponent,canActivate : [DirectorGuard] },
  {path:'officer', component:OfficerDashboardComponent, canActivate : [OfficerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
