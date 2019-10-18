import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { authUrl, userUrl, User, IUserForm, IUserCredentials } from 'api';
import { Observable, of, Subject, MonoTypeOperatorFunction } from 'rxjs';
import { catchError, tap, map, retryWhen, mergeMap } from 'rxjs/operators';
import { NotificationService } from '../notification.service';

export enum AuthStatus {
  Success,
  Forbidden,
  MailTaken,
  SocialInvalid,
  Invalid,
  Illegal,
  InternalError
}

export enum OpStatus {
  Success,
  Forbidden,
  Illegal,
  InternalError
}

interface Token {
  token: string;
}

@Injectable()
export class LocalAuthService {
  constructor(private http: HttpClient, private notifier: NotificationService) {
    this.loadTokens();
    this.user.subscribe(user => {
      if (user) notifier.notify(`Hola ${user.firstname}, bienvenido`, null, 2000);
    });
  }

  private _user: User;
  private userSubject: Subject<User> = new Subject();
  public get user() {
    return this.userSubject.asObservable();
  }

  private authChangeSubject = new Subject();
  public get onAuthChange() {
    return this.authChangeSubject.asObservable();
  }

  public hasToken = false;
  private _refreshToken: string = undefined;
  private set refreshToken(value: string) {
    this._refreshToken = this.signRefresh['x-access-token'] = value;
  }

  private _session: string = undefined;
  private set session(value: string) {
    this._session = this.sign['x-access-token'] = value;
    this.authChangeSubject.next();
  }

  public signRefresh: { [header: string]: string | string[] } = { 'x-access-token': this._refreshToken };
  public sign: { [header: string]: string | string[] } = { };

  public headerPassword(pwd: string) {
    const signed = this.sign;
    signed.pwd = pwd;
    return signed;
  }

  getUser(): User {
    return this._user;
  }

  loggedIn(): boolean {
    return this._session !== undefined && this._session !== 'undefined';
  }

  loadTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.updateToken(refreshToken);
  }

  updateToken(refreshToken: string) {
    if (refreshToken !== null && refreshToken !== 'undefined') {
      this.hasToken = true;
      this.refreshToken = refreshToken;
      this.getAccessToken().subscribe(token => this.updateAccessToken(token));
    }
  }

  updateAccessToken(accessToken: string) {
    this.session = accessToken;
    this.updateUser();
  }

  ensureAccessToken<T>(): MonoTypeOperatorFunction<T> {
    return retryWhen<T>(_ =>
      _.pipe(
        mergeMap(err => {
          if (err.status || err.status === 406)
            return this.getAccessToken().pipe(tap(token => this.updateAccessToken(token)));
          throw err;
        })
      )
    );
  }

  notify(msg: string) {
    this.notifier.notify(msg);
  }

  getAccessToken(): Observable<string> {
    return this.http.get<{ token: string }>(`${authUrl}/token`, { headers: this.signRefresh }).pipe(map(_ => _.token));
  }

  closeSession() {
    this.refreshToken = undefined;
    this.session = undefined;
    this.userSubject.next(undefined);
    this._user = undefined;
    this.hasToken = false;
    localStorage.setItem('refreshToken', undefined);
  }

  updateUser() {
    this.http
      .get<IUserForm>(userUrl, { headers: this.sign })
      .pipe(
        this.ensureAccessToken(),
        map(data => new User(data)),
        tap(user => this.userSubject.next(user))
      )
      .subscribe(user => (this._user = user), err => console.log('err:', err));
  }

  updateData(data: {
    country?: number;
    state?: number;
    city?: number;
    genre?: boolean; // True for Male
    area_code?: string;
    cellphone?: string;
  }): Observable<OpStatus> {
    return this.handleStatus(this.http.post(`${authUrl}/update`, data, { headers: this.sign })).pipe(
      this.ensureAccessToken()
    );
  }

  changePassword(old: string, fresh: string): Observable<OpStatus> {
    return this.handleStatus(this.http.put(authUrl, fresh, { headers: this.headerPassword(old) }));
  }

  deleteUser(pwd: string): Observable<OpStatus> {
    return this.handleStatus(this.http.delete(authUrl, { headers: this.headerPassword(pwd) }));
  }

  googleLogin(authKey: string, remember: boolean = false): Observable<AuthStatus> {
    return this.auth(this.http.get<Token>(`${authUrl}/google/${authKey}`), remember);
  }

  facebookLogin(authKey: string, remember: boolean = false): Observable<AuthStatus> {
    return this.auth(this.http.get<Token>(`${authUrl}/facebook/${authKey}`), remember);
  }

  login(user: string, pass: string, remember: boolean = false): Observable<AuthStatus> {
    return this.auth(this.http.post<Token>(`${authUrl}/login/${user}`, { pass }), remember);
  }

  signup(user: IUserCredentials, remember: boolean = false): Observable<AuthStatus> {
    return this.auth(this.http.post<Token>(authUrl, user), remember);
  }

  private handleStatus(obs: Observable<any>): Observable<OpStatus> {
    return obs.pipe(
      catchError(error => {
        let status: OpStatus;
        switch (error.status || -1) {
          case 403:
            this.notify('No tiene permisos para hacer eso');
            status = OpStatus.Forbidden;
            break;
          case 400:
            this.notify('Los datos no son válidos');
            status = OpStatus.Illegal;
            break;
          default:
            this.notify('Hubo un error interno. Intente de nuevo');
            status = OpStatus.InternalError;
            break;
        }
        // tslint:disable-next-line: deprecation
        return of({ type: 'OpStatus', status });
      }),
      map(data => {
        if (data.type === 'OpStatus') return data.status;
        return OpStatus.Success;
      })
    );
  }

  private auth(obs: Observable<Token>, remember: boolean): Observable<AuthStatus> {
    return obs.pipe(
      map(obj => obj.token),
      tap(token => {
        if (token) {
          if (remember) localStorage.setItem('refreshToken', token);
          this.updateToken(token);
        }
      }),
      catchError(error => {
        console.log(error);
        let status: AuthStatus;
        if (error.status && error.status === 404) {
          this.notify('Usuario y/o contraseña incorrectos');
          status = AuthStatus.Invalid;
        } else if (error.status && error.status === 403) {
          this.notify('No posee permisos suficientes');
          status = AuthStatus.Forbidden;
        } else if (error.status && error.status === 401) {
          this.notify('Hubo un error en la comuncación con una red social');
          status = AuthStatus.SocialInvalid;
        } else if (error.status && error.status === 400) {
          this.notify('Los datos no son válidos');
          status = AuthStatus.Illegal;
        } else if (error.status && error.status === 409) {
          this.notify('Ese correo no se encuentra disponible');
          status = AuthStatus.MailTaken;
        } else {
          this.notify('Hubo un error con la autentificación. Intente de nuevo');
          status = AuthStatus.InternalError;
        }
        // tslint:disable-next-line: deprecation
        return of(status);
      }),
      map(data => {
        if (typeof data === 'string') return AuthStatus.Success;
        return data;
      })
    );
  }
}
