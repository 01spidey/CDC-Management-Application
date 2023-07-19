import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { placementStats, placementStatsResponse, reportSummaryResponse, summaryObject } from '../models/model';
import { AppService } from '../service/app.service';
import { FormBuilder, FormControl, FormControlName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export interface categoryStats{
  name:string,
  tot_offers:number,
  avg_ctc:number,
  max_ctc:number,
  color?:string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {


  section = 1
  
  status_filter = 'Batch'
  job_type_filter = 'All'

  role = sessionStorage.getItem('user_role')!
  userData = JSON.parse(sessionStorage.getItem('cur_user_data')!);

  tot_reports = 0
  tot_companies = 0
  active_staffs = 0

  startDate = ''
  endDate = ''
  today = new Date();
  threeMonthsAgo = new Date(this.today.getFullYear(), this.today.getMonth() - 3, this.today.getDate());

  report_summary:summaryObject[] = []
  category_lst:categoryStats[] = []

  batch_indi:number = 0
  cur_year = 0
  batch_lst:number[] = []
  start_year = 0
  end_year = 0

  charts : {
    dept_chart : boolean,
    ctc_chart : boolean,
    gender_chart : boolean,
    cgpa_chart : boolean ,
    overall_chart : boolean
  } = {
    dept_chart: true,
    ctc_chart: true,
    gender_chart: true,
    cgpa_chart: true,
    overall_chart: true
  }

  placement_stats! : placementStats;
  private dept_chart!: any;
  private ctc_chart!: any;
  private cgpa_chart!: any;
  private gender_chart!:any;
  private overall_chart!:any;


  // ---------------------------------------------------------
  dropdown = 0
  // ---------------------------------------------------------




  
  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }


  ngAfterViewInit(): void {
    this.initializeCharts('dept_chart');  
  }

  ngOnInit(): void {
    
    this.placement_stats = {
      placed_students: [],
    package: {
      max: 0,
      max_count : 0,
      avg: 0,
      median: 0,
      mode: 0
    },
    offers: {
      total: 0,
      multi_offers: 0
    },
    companies: {
      total: 0,
      offered: 0
    },
    drives: {
      total: 0,
      offered: 0
    }
    }

    
    // this.initializeCharts('ctc_chart');
    // this.initializeCharts('cgpa_chart');
    // this.initializeCharts('gender_chart');

    this.cur_year= new Date().getFullYear();
    for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
    this.batch_indi = this.cur_year+1;

    this.start_year = this.cur_year-10
    this.end_year = this.cur_year+5
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  changeFilter(status_filter:string, job_type_filter:string){
    this.status_filter = status_filter
    this.job_type_filter = job_type_filter
    
    this.applyFilter(this.status_filter, job_type_filter)
  }

  applyFilter(status_filter:string, job_type_filter:string){
    console.log(status_filter, job_type_filter, this.batch_indi)
    
    let data = {
      status_filter: status_filter,
      job_type_filter: job_type_filter,
      start_year: this.start_year,
      end_year: this.end_year,
      batch : this.batch_indi
    }

    this.service.getPlacementStats(data).subscribe(
      (res:placementStatsResponse)=>{
        console.log(res)
        this.placement_stats = res.stats
      },
      (err)=>{
        this.toastr.error(err.error.message, 'Error')
      }
    )
    .add(()=>{
      this.service.getCompanyCategoryStats(data).subscribe(
        (res:{
          success:boolean, 
          stats:categoryStats[]
        })=>{
            if(res.success){
              this.category_lst = res.stats
              console.log(res.stats)
            }
            else this.toastr.error('Error', 'Error')
          },
          (err)=>{
            this.toastr.error(err.error.message, 'Error')
          }
        )
      },
    )
  }

  onBatchChange(selectedBatch:string){
    this.batch_indi = parseInt(selectedBatch)
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  initializeCharts(chart:string){
    
    this.dept_chart = new Chart('dept_bar_chart', {
      type: 'bar',
      
      data: {
        labels: ['AI-DS', 'CSE', 'ECE', 'EEE', 'BME', 'MECH', 'CIVIL', 'CHEM'],
        datasets: [{
          label: 'placement %',
          data: [70, 80, 70, 80, 54, 42.1, 35.3, 20],
          borderWidth: 0,
          backgroundColor: '#2196f3',
          hoverBackgroundColor: '#2196f3de',
          borderRadius: 7
        }],
        
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            display: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            },
            title: {
              display: true,
              text: 'Placement %',
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 15,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
          },

          y: {
            beginAtZero: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            }
            
          },
          
        }
      }
    });

    this.ctc_chart = new Chart('ctc_bar_chart', {
      type: 'bar',
      
      data: {
        labels: ['AI-DS', 'CSE', 'ECE', 'EEE', 'BME', 'MECH', 'CIVIL', 'CHEM'],
        datasets: [{
          label: 'placement %',
          data: [70, 80, 70, 80, 54, 42.1, 35.3, 20],
          borderWidth: 0,
          backgroundColor: '#fc8019',
          hoverBackgroundColor: '#fc8019de',
          borderRadius: 7
        }],
        
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            }
          },

          y: {
            beginAtZero: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            },
            title: {
              display: true,
              text: 'CTC (LPA)',
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 15,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
          },
          
        }
      }
    });

    this.cgpa_chart = new Chart('cgpa_bar_chart', {
      type: 'bar',
      
      data: {
        labels: ['AI-DS', 'CSE', 'ECE', 'EEE', 'BME', 'MECH', 'CIVIL', 'CHEM'],
        datasets: [{
          label: 'placement %',
          data: [70, 80, 70, 80, 54, 42.1, 35.3, 20],
          borderWidth: 0,
          backgroundColor: '#43dd88',
          hoverBackgroundColor: '#43dd88de',
          borderRadius: 7
        }],
        
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            }
          },

          y: {
            beginAtZero: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            },
            title: {
              display: true,
              text: 'CTC (LPA)',
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 15,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
          },
          
        }
      }
    });

    this.gender_chart = new Chart('gender_pie_chart',
    {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Others'],
        datasets: [
          {
            hoverOffset: 10,
            label: 'Placement %',
            data: [54, 42.1, 3.9],
            backgroundColor: ['#2196f3', '#fc8019', '#43dd88'],
          }
        ]
      },
      options: {
        responsive: true,
        
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Placement By Gender'
          }
        }
      },
    });

    this.overall_chart = new Chart('overall_line_chart', {
      type: 'line',
      data: {
          labels: ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
              label: 'Series 1', // Name the series
              data: [24, 36, 45, 76, 23, 45, 95, 67, 34, 52, 31, 24], // Specify the data values array
              fill: true,
              borderColor: '#2196f3', // Add custom color border (Line)
              backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
          }]
      },
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        scales: {
          x: {
            display: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            }
          },

          y: {
            beginAtZero: true,
            ticks: {
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              }
            },
            title: {
              display: true,
              text: 'Plcament %',
              color: '#35363a',
              font: {
                family: 'Nunito',
                size: 15,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
          },
          
        }
      }
  });



  
  }

}

