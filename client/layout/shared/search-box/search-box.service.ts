import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { typeaheadUrl } from 'api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchBoxService {
  constructor(private http: HttpClient) {}

  getMatches(lookup: string, count: number): Observable<string[]> {
    return this.http.get<string[]>(`${typeaheadUrl}/${lookup}/${count}`);
  }
}
