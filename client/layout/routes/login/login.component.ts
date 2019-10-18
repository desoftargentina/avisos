import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { LocalAuthService, AuthStatus, NavigatorService } from 'client/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private social: AuthService,
    private auth: LocalAuthService,
    private navigator: NavigatorService
  ) {
    auth.onAuthChange.subscribe(() => navigator.navigate('dashboard'));
  }

  loginForm = this.fb.group({
    mail: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required],
    cred_hold: ['']
  });

  loading = false;

  private _enabled = true;
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (value) {
      this.loginForm.enable();
    } else {
      this.loginForm.disable();
    }
  }

  get form() {
    return this.loginForm.controls;
  }
  get mail() {
    return this.form.mail;
  }
  get pass() {
    return this.form.pass;
  }
  get cred_hold() {
    return this.form.cred_hold;
  }

  googleSignIn() {
    this.social.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.enabled = false;
      this.loading = true;
      this.auth.googleLogin(data.authToken, this.cred_hold.value).subscribe(this.handle.bind(this));
    });
  }

  facebookSignIn() {
    this.social.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
      this.enabled = false;
      this.loading = true;
      this.auth.facebookLogin(data.authToken, this.cred_hold.value).subscribe(this.handle.bind(this));
    });
  }

  onLogin() {
    this.enabled = false;
    this.loading = true;
    this.auth.login(this.mail.value, this.pass.value, this.cred_hold.value).subscribe(this.handle.bind(this));
  }

  handle(status: AuthStatus) {
    this.loading = false;
    if (status === AuthStatus.Success) this.navigator.goBack('');
  }
}
