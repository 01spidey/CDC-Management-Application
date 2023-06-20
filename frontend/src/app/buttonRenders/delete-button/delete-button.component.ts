import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ReportsComponent } from 'src/app/reports/reports.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent implements ICellRendererAngularComp{
  params: any;
  pk = 0
  user_staff_id = ''
  report_staff_id = ''

  // @Input() userData!:object

  constructor(
    private reportComponent : ReportsComponent
  ) { 

  }

  agInit(params: any): void {
    this.params = params;
    this.pk = params.data.pk;
    this.user_staff_id = params.staff_id;
    this.report_staff_id = params.data.staff_id;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onButtonClick(): void {
    const pk = this.params.data.pk;
    this.reportComponent.deleteReport(pk);
  }
}
