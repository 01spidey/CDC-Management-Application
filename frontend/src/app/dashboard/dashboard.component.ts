import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { getChartsDataResponse, placementStats, placementStatsResponse, reportSummaryResponse, summaryObject } from '../models/model';
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
  dept_chart_data!: number[];
  ctc_chart_labels!: any[];
  ctc_chart_data!: any[];
  cgpa_chart_data!: any[];
  gender_chart_data!: any[];
  overall_chart_data!: any[];
  overall_chart_labels!: any[];

  full_screen_chart:string = ''
  // ---------------------------------------------------------

  constructor(
    private service : AppService,
    private builder : FormBuilder,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) { }


  ngAfterViewInit(): void {
    this.getChartsData();  
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
        .add(()=>{
          this.getChartsData();
        })
      },
    )
    
  }

  makeFullScreenChart(chart:string){
    this.full_screen_chart =chart
    this.initializeCharts()
  }

  getChartsData(){
    
    let data = {
      status_filter: this.status_filter,
      job_type_filter: this.job_type_filter,
      start_year: this.start_year,
      end_year: this.end_year,
      batch : this.batch_indi
    }

    this.service.getChartsData(data).subscribe(
      (res:getChartsDataResponse)=>{
        if(res.success){
          console.log(res)
          let charts_data = res.charts_data
          this.dept_chart_data = charts_data.dept_chart.dept_chart_data
          this.ctc_chart_labels = charts_data.ctc_chart.ctc_chart_labels
          this.ctc_chart_data = charts_data.ctc_chart.ctc_chart_data
          this.cgpa_chart_data = charts_data.cgpa_chart.cgpa_chart_data
          this.gender_chart_data = charts_data.gender_chart.gender_chart_data
          this.overall_chart_data = charts_data.overall_chart.overall_chart_data
          this.overall_chart_labels = charts_data.overall_chart.overall_chart_labels

          this.initializeCharts()

        }else this.toastr.error('Something went wrong')
      },
      (err)=>{
        this.toastr.error('Server Not Responding')
      }
    )

  }

  onBatchChange(selectedBatch:string){
    this.batch_indi = parseInt(selectedBatch)
    this.applyFilter(this.status_filter, this.job_type_filter)
  }

  initializeCharts(){
    if(this.dept_chart) this.dept_chart.destroy()
    if(this.ctc_chart) this.ctc_chart.destroy()
    if(this.cgpa_chart) this.cgpa_chart.destroy()
    if(this.gender_chart) this.gender_chart.destroy()
    if(this.overall_chart) this.overall_chart.destroy()

    // Initialize Department Chart
    this.dept_chart = new Chart('dept_bar_chart', {
      type: 'bar',
      
      data: {
        labels: ['', 'AI - DS', 'BME', 'CHEM', 'CIVIL', 'CSE', 'ECE', 'EEE', 'MECH', ''],
        datasets: [{
          label: 'Offers',
          data: this.dept_chart_data,
          borderWidth: 0,
          backgroundColor: '#2196f3',
          hoverBackgroundColor: '#2196f3de',
          borderRadius: 7,
          barPercentage: 1,
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
              text: 'Offers',
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
            grid: {
              display: false
            },
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

    // Initialize CTC Chart
    this.ctc_chart = new Chart('ctc_line_chart', {
      type: 'bar',
      
      data: {
        labels: this.ctc_chart_labels,
        datasets: [{
          label: 'placement %',
          data: this.ctc_chart_data,
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
              text: 'Offers',
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

    // Initialize CGPA Chart
    this.cgpa_chart = new Chart('cgpa_bar_chart', {
      type: 'bar',
      
      data: {
        labels: ['0.0-2.0', '2.0-3.0', '3.0-4.0', '4.0-5.0', '5.0-6.0', '6.0-7.0', '7.0-8.0', '8.0-10.0'],
        
        datasets: [{
          label: 'placement %',
          data: this.cgpa_chart_data,
          borderWidth: 0,
          backgroundColor: '#43dd88',
          hoverBackgroundColor: '#43dd88de',
          borderRadius: 7,
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
              },
            },
            title: {
              display: true,
              text: 'CGPA',
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
            },
            title: {
              display: true,
              text: 'Offers',
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

    console.log(this.gender_chart_data)
    // Intialize Gender Chart
    this.gender_chart = new Chart('gender_pie_chart',
        {
          type: 'pie',
          data: {
            labels: ['Male', 'Female', 'Others'],
            datasets: [
              {
                hoverOffset: 10,
                label: 'Placement %',
                data: this.gender_chart_data,
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
    
    // Initialize Overall Chart
    this.overall_chart = new Chart('overall_line_chart', {
      type: 'line',
      data: {
          labels: this.overall_chart_labels,
          
          datasets: [{
              label: 'Offers', // Name the series
              data: this.overall_chart_data, // Specify the data values array
              fill: true,
              borderColor: '#35363a', // Add custom color border (Line)
              // Add gradient backgroud color
              backgroundColor: '#7c5cfc',
              hoverBackgroundColor: '#ffffff',
              borderWidth: 2, // Specify bar border width,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: 'black',
              pointBorderWidth: 1.5,
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
              text: 'Offers',
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

