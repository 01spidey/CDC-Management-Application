import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ToastrModule} from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { DriveComponent } from './drive/drive.component';
import { ProfileComponent } from './profile/profile.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { ReportsComponent } from './reports/reports.component';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginGuard } from './guard/login.guard';
import { AuthGuard } from './guard/auth.guard';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DirectorDashboardComponent,
    OfficerDashboardComponent,
    MyTeamComponent,
    DriveComponent,
    ProfileComponent,
    AddMemberComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [
    DatePipe,
    LoginGuard,
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
