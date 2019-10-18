import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageUploaderComponent } from './image-uploader.component';
import { AddImageComponent } from './add-image';
import { ShowImageComponent } from './show-image';
import { IconModule } from 'client/layout/custom';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [ImageUploaderComponent, AddImageComponent, ShowImageComponent],
  imports: [CommonModule, IconModule, MatProgressSpinnerModule, MatTooltipModule, MatButtonModule, MatProgressBarModule],
  exports: [ImageUploaderComponent]
})
export class ImageUploaderModule { }
