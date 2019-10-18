import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';
import { AssetsService } from './assets.service';
import { favicon } from 'api';

@Injectable({ providedIn: 'root' })
export class FaviconService {
  constructor(theme: ThemeService, private assets: AssetsService) {
    if (theme.getThemeLabel()) this.changeFavicon(assets.getPath(favicon));
  }

  changeFavicon(src: string) {
    const link = document.createElement('link'),
      oldLink = document.getElementById('favicon');
    link.id = 'favicon';
    link.rel = 'shortcut icon';
    link.addEventListener('onerror', this.defaultFavicon);
    link.href = src;
    if (oldLink) document.head.removeChild(oldLink);
    document.head.appendChild(link);
  }

  private defaultFavicon(event) {
    console.log(typeof event);
    event.target.href = this.assets.getDefaultPath(favicon);
  }
}
