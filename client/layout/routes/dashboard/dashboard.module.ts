import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { MatButtonModule } from '@angular/material/button';
import { IconModule } from 'client/layout/custom/icon/icon.module';

const routes: Routes = [
  {
      path: '', component: DashboardComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MatButtonModule, IconModule],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
