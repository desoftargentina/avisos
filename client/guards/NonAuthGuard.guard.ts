import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { LocalAuthService } from 'client/services';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanLoad {
  constructor(private auth: LocalAuthService) {}

  canLoad(): boolean {
    return !this.auth.loggedIn();
  }
}
