import { Component, Input, OnInit } from '@angular/core';
import { AssetsService } from 'client/services';
import { not_found } from 'api';

@Component({
    selector: 'avisos-img',
    template: `<img [src]="trueSrc" (error)="onError($event)" draggable="false"/>`
})
export class ImageComponent implements OnInit {
    @Input() src: string;
    @Input() asset: string;
    @Input() default: string;
    errorCount = 0;
    trueSrc: string;

    constructor(private assets: AssetsService) { }

    ngOnInit() {
        if (this.src) this.trueSrc = this.src;
        else this.trueSrc = this.asset;
    }

    onError(event: any) {
        switch (this.errorCount) {
            case 0:
                if (!this.src && this.asset) event.target.src = this.assets.getDefaultPath(this.asset);
                else event.target.src = this.assets.getPath(not_found);
                break;
            case 1:
                if (!this.src && this.asset) event.target.src = this.assets.getPath(not_found);
                else event.target.src = this.assets.getDefaultPath(not_found);
                break;
            default:
                event.target.src = this.assets.getDefaultPath(not_found);
        }
        ++this.errorCount;
    }
}