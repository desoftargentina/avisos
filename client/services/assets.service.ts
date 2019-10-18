import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  constructor(private theme: ThemeService) {}

  getPath(asset: string) {
    return this.getAssetPath(asset, this.theme.getThemeLabel());
  }

  getAssetPath(asset: string, profile?: string) {
    let path = 'assets';
    if (profile) path = `${path}/${profile}`;
    return `${path}/${asset}`;
  }

  getDefaultPath(asset: string) {
    return this.getAssetPath(asset);
  }
}
