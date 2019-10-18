import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectorComponent } from './category-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CategorySelectorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [CategorySelectorComponent]
})
export class CategorySelectorModule {}
