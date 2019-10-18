import { Component, ViewChild, ElementRef, AfterContentChecked, AfterContentInit } from '@angular/core';
import { ThemeService } from 'client/services';

@Component({
  selector: 'avisos-root',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements AfterContentInit, AfterContentChecked {
  @ViewChild('header', { read: ElementRef, static: true }) headerView: ElementRef;
  private height: number;
  private dirty: boolean;

  isDark: boolean;
  themeLabel: string;

  constructor(theme: ThemeService) {
    this.isDark = theme.getDarkTheme();
    this.themeLabel = theme.getThemeLabel();

    theme.isDarkTheme.subscribe((dark: boolean) => (this.isDark = dark));
    theme.themeLabel.subscribe((themeLabel: string) => (this.themeLabel = themeLabel));
  }

  ngAfterContentInit() {
    this.height = this.headerView.nativeElement.offsetHeight;
    sessionStorage.setItem('innerContentHeight', '' + (window.innerHeight - this.height));
    sessionStorage.setItem('headerHeight', '' + this.height);
  }

  ngAfterContentChecked() {
    if (this.dirty) {
      this.height = this.headerView.nativeElement.offsetHeight;
      sessionStorage.setItem('innerContentHeight', '' + (window.innerHeight - this.height));
      sessionStorage.setItem('headerHeight', '' + this.height);
      this.dirty = false;
    }
  }

  get theme() {
    return this.themeLabel === undefined ? this.themeLabel : `${this.themeLabel}-theme`;
  }

  get headerHeight() {
    this.dirty = true;
    return this.height;
  }
}
