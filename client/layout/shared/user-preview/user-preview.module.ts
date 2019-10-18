import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserPreviewComponent } from './user-preview.component';
import { LocatorModule } from '../locator/locator.module';
import { TaggerModule } from '../tagger/tagger.module';
import { IconModule } from 'client/layout/custom';

@NgModule({
  declarations: [UserPreviewComponent],
  imports: [CommonModule, RouterModule, LocatorModule, TaggerModule, IconModule],
  exports: [UserPreviewComponent]
})
export class UserPreviewModule { }
