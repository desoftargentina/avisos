import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AdminPublicationsComponent } from './publications.component';
import { CategorySelectorModule } from 'client/layout/shared';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [ { path: '', component: AdminPublicationsComponent } ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
    
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
    CategorySelectorModule
  ],
  exports: [],
  declarations: [AdminPublicationsComponent],
  providers: []
})
export class AdminPublicationsModule {}
