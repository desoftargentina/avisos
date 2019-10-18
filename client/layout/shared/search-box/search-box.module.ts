import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBoxComponent } from './search-box.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '../../custom';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,

    IconModule
  ],
  declarations: [SearchBoxComponent],
  exports: [SearchBoxComponent]
})
export class SearchBoxModule {}
