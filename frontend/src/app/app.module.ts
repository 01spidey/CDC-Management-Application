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
import { DriveComponent } from './drive/drive.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule, DatePipe } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SummaryComponent } from './summary/summary.component';
import { NotificationComponent } from './notification/notification.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { LoginGuard } from './guard/login.guard';
import {HomeGuard} from './guard/home.guard'
import { OfficerGuard } from './guard/officer.guard';
import { DirectorGuard } from './guard/director.guard';
import { CompanyComponent } from './company/company.component';
import { PopupComponent } from './popup/popup.component';
import { DrivePopupComponent } from './drive-popup/drive-popup.component';
import { StudentTableComponent } from './student-table/student-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { PlacementsComponent } from './placements/placements.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DirectorDashboardComponent,
    OfficerDashboardComponent,
    DriveComponent,
    ProfileComponent,
    SummaryComponent,
    NotificationComponent,
    CompanyComponent,
    PopupComponent,
    DrivePopupComponent,
    StudentTableComponent,
    DashboardComponent,
    ReportsComponent,
    ReportTableComponent,
    PlacementsComponent
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
    MatSlideToggleModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderModule,
    NgxOtpInputModule
  ],
  providers: [
    DatePipe,
    LoginGuard,
    HomeGuard,
    OfficerGuard,
    DirectorGuard

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
