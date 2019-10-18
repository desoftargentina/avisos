import { Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Component } from '@angular/core';
import { Preview, storagePath, not_found } from 'api';

@Component({
  selector: 'preview',
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() data: Preview;
  @Output() hover: EventEmitter<boolean> = new EventEmitter();

  storage = storagePath;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.hover.emit(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hover.emit(false);
  }

  goDefault(event) {
    event.target.src = `assets/${not_found}`;
  }
}
