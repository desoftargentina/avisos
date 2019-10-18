import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { LocalAuthService } from 'client/services';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanLoad {
  constructor(private auth: LocalAuthService) {}

  canLoad(): boolean | Observable<boolean> {
    if (this.auth.getUser()) return this.auth.getUser().isAdmin;
    else if (this.auth.hasToken) {
      return this.auth.user.pipe(
        map(user => user.isAdmin),
        take(1)
      );
    } else return false;
  }
}
