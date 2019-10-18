import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

let _bl: string[] = [];
let _wl: string[] = [];

@Injectable()
export class NavigatorService {
  private urlStack: string[] = [];
  private self = false;
  constructor(private router: Router) {
    router.events
      .pipe(
        filter(_ => {
          if (this.self) {
            this.self = false;
            return false;
          }
          return true;
        }),
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd),
        map(event => event.url),
        filter(url => this.isValid(url))
      )
      .subscribe(url => this.urlStack.push(url));
  }

  static blacklist(...items: string[]) {
    _bl = _bl.concat(items);
  }

  static whitelist(...items: string[]) {
    _wl = _wl.concat(items);
  }

  goBack(def: string = '') {
    const url = this.urlStack.pop();
    this.self = true;
    if (url) this.navigate(url);
    else if (def !== undefined) this.navigate(def);
    else this.self = false;
  }

  navigate(url: string) {
    const data = url.split('?', 2);
    if (data.length > 1) {
      let params: string[];
      params = data[1].split('&');
      const queryParams = {};
      for (const param of params) {
        const pair = param.split('=');
        queryParams[pair[0]] = pair.length > 1 ? pair[1] : 'true';
      }
      this.router.navigate([data[0]], { queryParams });
    } else this.router.navigate([url]);
  }

  private isValid(url: string) {
    console.log('url:', url);
    return _wl.includes(url) || !_bl.includes(url);
  }
}
