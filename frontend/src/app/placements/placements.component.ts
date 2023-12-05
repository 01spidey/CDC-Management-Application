import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../service/app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export interface PlacedStudent{
  sno:number;
  name:string;
  regno:string;
  dept:string;
  batch:string;
  appointment_id:string;
  company:string;
  mode:string;
  ctc:number;
  offer_letter_link:URL;
}

@Component({
  selector: 'app-placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss']
})

export class PlacementsComponent implements OnInit{
  filter:string = 'All'
  dept_lst:string[] = ["AI-DS", "CSE", "ECE", "EEE", "BME", "CHEM", "CIVIL", "MECH"]
  selected_dept:string[] = []
  batch:number = 0
  batch_lst:number[] = []
  cur_year = 0
  PLACED_STUDENTS!:MatTableDataSource<PlacedStudent>;
  displayedColumns: string[] = ["sno", "name", "regno", "dept", "batch", "appointment_id", "company", "mode", "ctc", "offer_letter_link"]
  pageSizeOptions: number[] = [3, 5, 10, 15];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appService:AppService
  ){ }

  ngOnInit(): void {
      this.selected_dept.push("All")
      this.cur_year= new Date().getFullYear();
      for(let i=this.cur_year-10; i<=this.cur_year+5; i++) this.batch_lst.push(i);
      this.batch = this.cur_year+1;

      this.getPlacedStudents(this.selected_dept, this.batch)
  }

  

  changeDept(dept:string){
    if(this.selected_dept.includes(dept)){
      // Remove from selected_dept because it is already selected
      if(this.selected_dept.length>1){
        if(dept!=="All"){
          this.selected_dept = this.selected_dept.filter((item)=>{
            return item != dept
          })
          this.getPlacedStudents(this.selected_dept, this.batch)
        }
      }
    }

    else{
      // Add to selected_dept because it is not selected
      if(dept == "All") this.selected_dept = ["All"]
      else{
        this.selected_dept = this.selected_dept.filter((item)=>{
          return item != "All"
        })
        this.selected_dept.push(dept)
      }
      this.getPlacedStudents(this.selected_dept, this.batch)
    }  
  }

  onBatchChange(selectedBatch:string){
    this.batch = parseInt(selectedBatch)
    this.getPlacedStudents(this.selected_dept, this.batch)
  }

  filterTable(e:any){
    const filterValue = (e.target as HTMLInputElement).value;
    this.PLACED_STUDENTS.filter = filterValue.trim().toLowerCase();
  }

  getPlacedStudents(dept_lst:string[], batch:number){
    let dept_str:string = ""
    if(dept_lst.includes("All")) dept_str = this.dept_lst.join("&");
    else dept_str = dept_lst.join("&");


    this.appService.getPlacedStudents(dept_str, batch)
    .subscribe(
      (res:any)=>{
        console.log(res)
        this.PLACED_STUDENTS = new MatTableDataSource(res.placed_students)
        this.PLACED_STUDENTS.paginator = this.paginator;
      },
      (err)=>{
        console.log(err)
      }
    )
  }

}
