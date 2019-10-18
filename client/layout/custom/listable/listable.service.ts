import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalAuthService } from 'client/services';
import { ListQuerier, readListQuerier, ListCount, ListFilters } from './types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ListableService {
  constructor(private http: HttpClient, private auth: LocalAuthService) {}

  list<T>(url: string, querier: ListQuerier, filters?: ListFilters): Observable<T[]> {
    return this.http.get<T[]>(readListQuerier(url, querier), { headers: this.auth.sign, params: filters });
  }

  count(url: string, filters?: ListFilters): Observable<number> {
    return this.http
      .get<ListCount>(`${url}/count`, { headers: this.auth.sign, params: filters })
      .pipe(map(data => data.count));
  }
}
