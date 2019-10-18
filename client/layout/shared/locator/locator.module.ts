import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocatorComponent } from './locator.component';
import { IconModule } from 'client/layout/custom';

@NgModule({
  declarations: [LocatorComponent],
  imports: [CommonModule, RouterModule, IconModule],
  exports: [LocatorComponent]
})
export class LocatorModule { }
