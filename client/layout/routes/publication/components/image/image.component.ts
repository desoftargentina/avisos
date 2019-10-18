import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Publish } from 'api';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'image',
  templateUrl: './image.component.html'
})
export class ImageComponent implements OnInit, OnDestroy {
  loading = true;
  fullscreen = false;
  imagePaths: string[] = [];

  private publishSubscription: Subscription;
  @Input() publish: Observable<Publish>;

  rootPath: string;
  lastMouse: { x: number; y: number } = { x: 0, y: 0 };
  tolDist = 2500;

  constructor() {}

  ngOnInit() {
    this.publishSubscription = this.publish
    .subscribe(publish => {
      this.rootPath = `${publish.publisher.id}/${publish.id}/img`;
      this.imagePaths = publish.images;
      this.loading = false;
    }, () => this.loading = false);
  }

  ngOnDestroy() {
    this.publishSubscription.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.fullscreen && event.key === 'Escape') this.fullscreen = false;
  }

  get innerHeight() {
    return +sessionStorage.getItem('innerContentHeight');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.lastMouse.x = event.x;
    this.lastMouse.y = event.y;
  }

  sqrDistance(event: MouseEvent): number {
    return Math.pow(event.x - this.lastMouse.x, 2) + Math.pow(event.y - this.lastMouse.y, 2);
  }

  toggleFullscreen(event: MouseEvent) {
    if (!this.rootPath || this.imagePaths.length < 1) return;
    if ((event.target as HTMLImageElement).tagName === 'IMG' && this.sqrDistance(event) < this.tolDist)
      this.fullscreen = !this.fullscreen;
  }
}
