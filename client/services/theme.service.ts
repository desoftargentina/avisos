import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark: boolean;
  private _theme: string;

  private _darkTheme = new Subject<boolean>();
  private _themeLabel = new Subject<string>();

  isDarkTheme = this._darkTheme.asObservable();
  themeLabel = this._themeLabel.asObservable();

  constructor() {
    const host: string = window.location.hostname;
    const parts = host.split('.');
    this._darkTheme.subscribe(dark => (this._dark = dark));
    this.themeLabel.subscribe(theme => (this._theme = theme));
    if (parts.length > 2 && parts[0].toLowerCase() !== 'www') this.setThemeLabel(parts[0]);
  }

  setDarkTheme(isDarkTheme: boolean): void {
    this._darkTheme.next(isDarkTheme);
  }

  getDarkTheme(): boolean {
    return this._dark;
  }

  setThemeLabel(themeLabel: string): void {
    this._themeLabel.next(themeLabel);
  }

  getThemeLabel(): string {
    return this._theme;
  }
}
