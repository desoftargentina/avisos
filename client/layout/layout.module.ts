import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, NonAuthGuard } from 'client/guards';
import { LocalAuthService, NavigatorService, NotificationService, UserService, provideConfig, ImageService } from 'client/services';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { IconModule } from './custom';
import { LayoutComponent } from './layout.component';
import { SearchBoxModule } from './shared';
import { publishMatcher } from './routes/publication';
import { SocialLoginModule, AuthServiceConfig, AuthService } from 'angularx-social-login';

import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/languages/es.js";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./routes/dashboard').then(m => m.DashboardModule) },
  { path: 'search', loadChildren: () => import('./routes/search').then(m => m.SearchModule) },
  {
    path: 'login', loadChildren: () => import('./routes/login').then(m => m.LoginModule),
    canLoad: [NonAuthGuard]
  },
  {
    path: 'register', loadChildren: () => import('./routes/register').then(m => m.RegisterModule),
    canLoad: [NonAuthGuard]
  },
  { path: 'login', redirectTo: 'dashboard' },
  { path: 'register', redirectTo: 'dashboard' },
  {
    path: 'publish', loadChildren: () => import('./routes/publish').then(m => m.PublishModule),
    canLoad: [AuthGuard]
  },
  { matcher: publishMatcher, loadChildren: () => import('./routes/publication').then(m => m.PublicationModule) },
  {
    path: 'admin', loadChildren: () => import('./routes/admin').then(m => m.AdminModule),
    canLoad: [AuthGuard, AdminGuard]
  },
  // { path: '**', loadChildren: './shared/not-found/not-found.module#NotFoundModule' }
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    SearchBoxModule,
    IconModule,

    SocialLoginModule,

    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTreeModule
  ],
  providers: [NavigatorService, NotificationService, LocalAuthService, UserService, ImageService, AuthService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }],
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  bootstrap: [LayoutComponent]
})
export class LayoutModule {
}
