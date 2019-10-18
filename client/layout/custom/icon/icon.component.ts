import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SizeProp, IconName } from '@fortawesome/fontawesome-svg-core';
import { Required } from 'client/utils/decorators';
import { IconLibrary } from './library.service';

@Component({
    selector: 'avisos-icon',
    template: `<fa-icon [icon]="lazyIcon" [size]="size"></fa-icon>`
})

export class IconComponent implements OnChanges {
    @Input() @Required icon: IconName;

    @Input() size: SizeProp = '1x';

    loaded = false;

    constructor(private library: IconLibrary) { }

    get lazyIcon(): IconName { if (this.loaded) return this.icon; return 'spinner'; }

    ngOnChanges(changes: SimpleChanges) {
        this.loaded = false;
        this.library.onLoad(changes.icon.currentValue).subscribe(() => this.loaded = true);
    }
}