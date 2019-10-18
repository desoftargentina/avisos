import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UploadType } from 'client/services';

export interface FileMeta {
  file: File,
  progress: Observable<UploadType>,
  uploaded: boolean,
  idx: number
};

@Component({
  selector: 'show-image',
  templateUrl: './show-image.component.html',
  styles: [
    `.img-preview {
      display: flex;
      padding: .2em;
      border-style: dotted;
      border-radius: 4px;
      height: 12em;
      width: 15em;
      overflow: hidden;
      justify-content: end;
    }`,
    `.img-preview img {
      object-fit: contain;
      width: 100%;
      height: 100;
    }`
  ]
})
export class ShowImageComponent implements OnInit {

  @Output() tryDelete: Subject<{id: number, serial: string, uploaded: boolean}> = new Subject();
  @Input() meta: FileMeta;

  url: string | ArrayBuffer;
  percentage = 0;
  serial: string;

  ngOnInit() {
    if (this.meta.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.meta.file);
      reader.onloadend = event => this.url = (event.target as FileReader).result;
    }

    this.meta.progress.subscribe(upload => {
      if (upload.serial) {
        this.percentage = undefined;
        this.serial = upload.serial;
      } else this.percentage = upload.progress;
    })
  }

  get filename() { return this.meta.file.name }

  delete() {
    this.tryDelete.next({id: this.meta.idx, serial: this.serial, uploaded: this.meta.uploaded});
  }
}
