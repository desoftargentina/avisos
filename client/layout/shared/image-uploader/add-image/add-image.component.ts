import { Component, ViewChild, ElementRef, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'add-image',
  templateUrl: './add-image.component.html',
  styles: [`.add-img {
      display: flex;
      border-style: dashed;
      border-radius: 4px;
      height: 12em;
      width: 15em;
  }`]
})
export class AddImageComponent {

  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef;
  @Output() fileEvent = new Subject<File>();

  openSelector() {
    this.fileInputRef.nativeElement.click();
  }

  onFile(event: { target: HTMLInputElement }) {
    if (event.target.files)
      for (let i = 0; i < event.target.files.length; ++i) {
        this.fileEvent.next(event.target.files.item(i));
      }
  }
}
