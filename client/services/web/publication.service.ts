import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishUrl, Publish, PublishSeed } from 'api';
import { LocalAuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PublicationService {
  constructor(private http: HttpClient, private auth: LocalAuthService) {}

  getDetails(publishID: number): Observable<Publish> {
    return this.http.get<Publish>(`${publishUrl}/${publishID}`, { headers: this.auth.sign });
  }

  getDescription(publishID: number): Observable<string> {
    return this.http.get(`${publishUrl}/description/${publishID}`, {responseType: 'text'});
  }

  savePublication(publish: PublishSeed): Observable<string> {
    return this.http.post<Publish>(publishUrl, publish, { headers: this.auth.sign }).pipe(
      map(pub =>
        '/'
          .concat(pub.name)
          .substr(0, 41)
          .replace(/ /g, '-')
          .replace(/--+/g, '-')
          .replace(/-+$/g, '')
          .concat('-' + pub.id)
      )
    );
  }

  approve(publishID: number): Observable<void> {
    return this.http.get<void>(`${publishUrl}/approve/${publishID}`, { headers: this.auth.sign });
  }

  pause(publishID: number): Observable<void> {
    return this.http.get<void>(`${publishUrl}/pause/${publishID}`, { headers: this.auth.sign });
  }

  resume(publishID: number) {
    return this.http.get<void>(`${publishUrl}/resume/${publishID}`, { headers: this.auth.sign });
  }
}
