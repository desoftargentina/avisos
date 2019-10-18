import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationComponent } from './publication.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImageComponent } from './components/image/image.component';
import { DetailsComponent } from './components/details/details.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IconModule } from 'client/layout/custom';
import { Routes, RouterModule } from '@angular/router';
import { LocatorModule, TaggerModule, UserPreviewModule, CarouselModule } from 'client/layout/shared';

const routes: Routes = [ { path: '', component: PublicationComponent } ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    TaggerModule,
    UserPreviewModule,
    LocatorModule,
    CarouselModule,

    MatProgressSpinnerModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,

    IconModule
  ],
  exports: [],
  declarations: [PublicationComponent, ContactComponent, ImageComponent, DetailsComponent],
  providers: []
})
export class PublicationModule {}
