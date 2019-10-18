import {
    Component,
    QueryList,
    ContentChildren,
    AfterContentInit,
    TemplateRef,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    AfterViewChecked
} from '@angular/core';
import { CarouselItemComponent } from './carousel-item.component';
import { not_found } from 'api';

@Component({
    selector: 'carousel',
    templateUrl: 'carousel.component.html',
    styles: [
        `.w-img { height: 70% }`,
        `.w-selector { height: 5% }`,
        `.w-preview { height: 25% }`
    ]
})
export class CarouselComponent implements AfterContentInit, AfterViewChecked {
    @ContentChildren(CarouselItemComponent) items !: QueryList<CarouselItemComponent>;
    @ViewChild('preview', { read: ElementRef, static: false }) previewEl: ElementRef;

    not_found = not_found;

    activeSrc: string;
    active: number = 0;
    templates: TemplateRef<any>[] = [];

    constructor(private changeDet: ChangeDetectorRef) { }

    ngAfterContentInit() {
        this.templates = this.items.map(item => item.template);
    }

    ngAfterViewChecked() { this.updateSrc(); this.changeDet.detectChanges(); }

    select(selection: number) {
        this.active = selection;
        this.updateSrc();
    }

    private updateSrc() {
        if (this.previewEl)
            this.activeSrc = this.findSrc(this.previewEl.nativeElement.children[this.active]);
    }

    private findSrc(el: any): string | undefined {
        if (el.tagName === 'IMG')
            return el.src;
        else
            for (let child of el.children)
                return this.findSrc(child);
    }
}