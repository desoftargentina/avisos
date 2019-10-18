import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusInvalidDirective } from './focus-invalid.directive';

@NgModule({
    imports: [CommonModule],
    exports: [FocusInvalidDirective ],
    declarations: [FocusInvalidDirective ],
    providers: [],
})
export class AvisosDirectivesModule { }
