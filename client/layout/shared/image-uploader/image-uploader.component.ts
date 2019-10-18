import { Component, Output } from '@angular/core';
import { ImageService, NotificationService } from 'client/services';
import { Subject } from 'rxjs';
import { FileMeta } from './show-image';

export enum FileEventType { Upload, Delete };

export interface FileEvent {
  serial: string,
  type: FileEventType
};

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent  {

  @Output() fileEvent = new Subject<FileEvent>();

  private idx = 0;
  fileList: { [idx: number]: FileMeta } = {};

  constructor(private images: ImageService, private notifications: NotificationService) { }

  onFile(file: File) {
    const event = this.images.upload(file);
    const index = ++this.idx;
    this.fileList[index] = { idx: index, file, progress: event, uploaded: false };

    event.subscribe(
      upload => { if (upload.serial) this.fileEvent.next({ serial: upload.serial, type: FileEventType.Upload }); },
      error => {
        this.notifications.popup('Hubo un error al subir el archivo ' + file.name + '. Intente de nuevo');
        delete this.fileList[index];
        console.error(error);
      });
  }

  get files() { return Object.values(this.fileList) }

  onDelete({ id, serial, uploaded }) {
    if (uploaded) this.fileEvent.next({ serial, type: FileEventType.Delete });
    else {
      this.images.delete(serial).subscribe();
      this.notifications.notify('Imagen eliminada', 'Aceptar', 1000);
    }
    delete this.fileList[id];
  }
}
