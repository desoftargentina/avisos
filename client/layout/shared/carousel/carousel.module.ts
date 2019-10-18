import { NgModule } from '@angular/core';

import { CarouselComponent } from './carousel.component';
import { CarouselItemComponent } from './carousel-item.component';
import { IconModule, ImageModule } from 'client/layout/custom';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [ CommonModule, IconModule, ImageModule ],
    exports: [CarouselComponent, CarouselItemComponent],
    declarations: [CarouselComponent, CarouselItemComponent],
    providers: [],
})
export class CarouselModule { }
