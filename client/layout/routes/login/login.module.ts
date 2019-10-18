import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconModule } from 'client/layout/custom';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SocialLoginModule } from 'angularx-social-login';

const routes: Routes = [ { path: '', component: LoginComponent } ];

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
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,

    IconModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
