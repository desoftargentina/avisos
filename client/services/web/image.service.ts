import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { imageUrl } from 'api';
import { LocalAuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

export interface UploadType {
    progress: number;
    serial?: string;
}

@Injectable()
export class ImageService {
    constructor(private http: HttpClient, private auth: LocalAuthService) { }

    upload(file: Blob): Observable<UploadType> {
        const form = new FormData();
        form.append('file', file);

        const emitter = new BehaviorSubject<UploadType>({ progress: 0 });

        this.http.post<{ serial: string }>(imageUrl, form,
            { headers: this.auth.sign, reportProgress: true, observe: 'events' }
        ).subscribe(event => {
            if (event && event.type === HttpEventType.UploadProgress)
                emitter.next({ progress: 100 * event.loaded / event.total });
            else if (event.type === HttpEventType.Response)
                emitter.next({ progress: 100, serial: event.body.serial });
        }, err => emitter.error(err), () => emitter.complete());

        return emitter;
    }

    delete(serial: string): Observable<void> {
        return this.http.delete<void>(`${imageUrl}/${serial}`, { headers: this.auth.sign });
    }

}
