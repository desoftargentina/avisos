import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'publications', pathMatch: '' },
      { path: 'publications',
      loadChildren: () => import('./routes/publications/publications.module').then(m => m.AdminPublicationsModule) }
    ]
  }
];

@NgModule({
  declarations: [AdminComponent, NavbarComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatTreeModule, MatButtonModule]
})
export class AdminModule {}
