import { Component, TemplateRef, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'carousel-item',
    template: `<ng-template #temp><img [class]="classes" [src]="src" /></ng-template>`
})
export class CarouselItemComponent {
    @ViewChild('temp', { read: TemplateRef, static: false }) public template: TemplateRef<any>;
    @Input() src: string;
    classes: string;

    constructor(el: ElementRef) {
        this.classes = el.nativeElement.className.replace('ng-star-inserted', '') + ' w-100';
    }
}