import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserPreview, userUrl } from 'api';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getPreview(id: number): Observable<IUserPreview> {
    return this.http.get<IUserPreview>(`${userUrl}/preview/${id}`);
  }
}
