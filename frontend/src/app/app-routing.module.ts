import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { LoginGuard } from './guard/login.guard';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path : '', component:HomeComponent},
  {path : 'login', component : LoginComponent}, //canActivate:[LoginGuard]
  {path:'director', component:DirectorDashboardComponent}, //canActivate:[AuthGuard]
  {path:'officer', component:OfficerDashboardComponent} //canActivate:[AuthGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
