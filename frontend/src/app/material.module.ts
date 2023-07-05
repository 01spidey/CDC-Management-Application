import { NgModule } from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import {MatSortModule} from "@angular/material/sort"
import {MatDialogModule} from "@angular/material/dialog"
import {MatSelectModule} from "@angular/material/select"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {MatIconModule} from '@angular/material/icon'
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule, matDatepickerAnimations} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';


@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatRadioModule,
        MatButtonModule,
        MatTableModule,MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
        MatSidenavModule,
        MatExpansionModule,
        MatChipsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatSliderModule
        
    ]
})
export class MaterialModule { }