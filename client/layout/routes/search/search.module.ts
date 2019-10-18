import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CardComponent } from './components/card/card.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchComponent } from './components/search/search.component';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatChipsModule } from '@angular/material/chips';
import { IconModule } from 'client/layout/custom';
import { Routes, RouterModule } from '@angular/router';
import { SearchService } from './search.service';

const routes: Routes = [{ path: '', component: SearchComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    MatDividerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatTreeModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    IconModule
  ],
  declarations: [SearchComponent, CardComponent, FilterComponent],
  providers: [SearchService]
})
export class SearchModule { }
