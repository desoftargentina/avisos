import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconModule } from 'client/layout/custom';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SocialLoginModule } from 'angularx-social-login';

const routes: Routes = [ { path: '', component: RegisterComponent } ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,

    SocialLoginModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatCheckboxModule,

    IconModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule {}
