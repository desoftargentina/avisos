import { Injectable } from '@angular/core';
import { Observable, from, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Preview, searchUrl } from 'api';
import { Params } from '@angular/router';

@Injectable()
export class SearchService {
  private id = -1;
  params: Observable<void>;
  private _params = new Subject<void>();

  constructor(private http: HttpClient) {
    this.params = this._params.asObservable();
  }

  setParams(urlParams: Params): Observable<number> {
    let httpParams = new HttpParams();
    for (const key of Object.keys(urlParams)) httpParams = httpParams.set(key, urlParams[key]);
    return this.http.post<string>(searchUrl, null, { params: httpParams }).pipe(
      map(str => +str),
      tap(id => (this.id = id)),
      tap(() => this._params.next())
    );
  }

  getNext(amount: number): Observable<Preview[]> {
    if (amount < 1) return from([]);
    return this.http.get<Preview[]>(`${searchUrl}/${this.id}/${amount}`);
  }

  getPriceRange(): Observable<{ min: number; max: number }> {
    return this.http.get<{ min: number; max: number }>(`${searchUrl}/${this.id}`);
  }

  leave() {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${searchUrl}/${this.id}`, false);
    xhr.send();
  }
}
