import { Component, Input, HostListener, OnInit } from '@angular/core';
import { LocalAuthService, AssetsService, ThemeService } from 'client/services';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { logo } from 'api';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input()
  sidenav: MatSidenav;

  username: string;
  isAdmin = false;
  loggedIn = false;

  isDark: boolean;

  constructor(
    private auth: LocalAuthService,
    private snackbar: MatSnackBar,
    private theme: ThemeService,
    private assets: AssetsService
  ) {
    auth.user.subscribe(user => {
      this.username = user.fullname;
      this.isAdmin = user.isAdmin;
    });
    if (auth.loggedIn()) {
      this.username = auth.getUser().fullname;
      this.isAdmin = auth.getUser().isAdmin;
      this.loggedIn = true;
    }
    auth.onAuthChange.subscribe(() => (this.loggedIn = auth.loggedIn()));
    this.isDark = theme.getDarkTheme();
  }

  get logo() {
    return this.assets.getPath(logo);
  }

  defaultLogo(event) {
    event.target.src = this.assets.getDefaultPath(logo);
  }

  @HostListener('window:resize', ['$event'])
  onresize(_) {
    if (this.sidenav.opened && window.innerWidth > 992) this.sidenav.close();
  }

  ngOnInit() {
    this.sidenav.autoFocus = false;
  }

  closeSession() {
    this.auth.closeSession();
    this.snackbar.open('Se ha cerrado la sesión', 'Aceptar', { duration: 4000 });
  }

  nightModeToggle() {
    this.isDark = !this.isDark;
    this.theme.setDarkTheme(this.isDark);
  }
}
