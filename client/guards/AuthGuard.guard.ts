import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { LocalAuthService, NotificationService } from 'client/services';
import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
  constructor(private router: Router,
    private auth: LocalAuthService,
    private notifications: NotificationService) {}

  canLoad(): boolean | Observable<boolean> {
    if (this.auth.loggedIn()) return true;
    else if (this.auth.hasToken)
      return this.auth.onAuthChange.pipe(
        map(() => this.auth.loggedIn()),
        tap(signed => {
          if (!signed) this.toLogin();
        }),
        take(1)
      );
    else {
      this.toLogin();
      return false;
    }
  }

  toLogin() {
    this.notifications.notify('Debes iniciar sesión primero.');
    this.router.navigate(['login']);
  }
}
