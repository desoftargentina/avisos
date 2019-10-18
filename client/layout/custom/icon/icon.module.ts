import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { IconComponent } from './icon.component';
import { IconLibrary } from './library.service';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    exports: [IconComponent],
    declarations: [IconComponent],
    providers: [IconLibrary],
})
export class IconModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faSpinner);
    }
}
