import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaggerComponent } from './tagger.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from 'client/layout/custom';

@NgModule({
  declarations: [TaggerComponent],
  imports: [CommonModule, RouterModule, MatChipsModule, MatTooltipModule, IconModule],
  exports: [TaggerComponent, MatChipsModule]
})
export class TaggerModule { }
