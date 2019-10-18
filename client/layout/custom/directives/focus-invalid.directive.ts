import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusInvalid]'
})
export class FocusInvalidDirective {

  constructor(private el: ElementRef) { }

  @HostListener('submit')
  onSubmit() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      let element = invalidElements[0], i = 0;
      while (element.localName in {'div': 0, 'mat-form-field': 1}) element = invalidElements[++i];
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {element.focus()}, 500);
    }
  }
}