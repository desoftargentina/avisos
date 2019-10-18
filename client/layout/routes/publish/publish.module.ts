import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PublishComponent } from './publish.component';
import { IconModule, AvisosDirectivesModule } from 'client/layout/custom';
import { CategorySelectorModule, LocatorFormModule, ImageUploaderModule } from 'client/layout/shared';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [ { path: '', component: PublishComponent } ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,

    IconModule,
    LocatorFormModule,
    CategorySelectorModule,
    AvisosDirectivesModule,
    ImageUploaderModule,

    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    FroalaEditorModule,
    FroalaViewModule
  ],
  exports: [],
  declarations: [PublishComponent],
  providers: []
})
export class PublishModule {}
