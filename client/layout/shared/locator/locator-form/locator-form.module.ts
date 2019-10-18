import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocatorFormComponent } from './locator-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [LocatorFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [LocatorFormComponent]
})
export class LocatorFormModule {}
