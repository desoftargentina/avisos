import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AuthStatus, LocalAuthService, NavigatorService } from 'client/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private social: AuthService,
    private auth: LocalAuthService,
    private navigator: NavigatorService
  ) {
    this.mail.setValidators([Validators.required, Validators.email, control => this.unusedMailValidator()(control)]);
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (value) {
      this.registerForm.enable();
    } else {
      this.registerForm.disable();
    }
  }

  get form() {
    return this.registerForm.controls;
  }
  get firstname() {
    return this.form.firstname;
  }
  get lastname() {
    return this.form.lastname;
  }
  get mail() {
    return this.form.mail;
  }
  get pass() {
    return this.form.pass;
  }
  get pass_rep() {
    return this.form.pass_rep;
  }

  get cred_hold() {
    return this.form.cred_hold;
  }

  registerForm = this.fb.group(
    {
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      mail: [''],
      pass: ['', Validators.required],
      pass_rep: ['', [Validators.required]],
      cred_hold: ['']
    },
    { validators: this.pwdMatchValidator() }
  );

  loading = false;
  private _enabled = true;
  private usedMails: string[] = [];

  pwdMatchValidator() {
    return (control: FormGroup): ValidationErrors | null => {
      const pass = control.get('pass'),
        pass_rep = control.get('pass_rep');
      return pass.value === pass_rep.value ? null : { pwdMatch: true };
    };
  }

  unusedMailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.usedMails.includes(control.value) ? { usedMail: true } : null;
    };
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

  onRegister() {
    if (!this.registerForm.valid) {
      if (this.registerForm.hasError('pwdMatch')) this.auth.notify('Las contraseñas no coinciden');
      return false;
    }

    this.enabled = false;
    this.loading = true;
    this.auth
      .signup(
        {
          firstname: this.firstname.value,
          lastname: this.lastname.value,
          email: this.mail.value,
          pass: this.pass.value
        },
        this.cred_hold.value
      )
      .subscribe(this.handle);
  }

  handle(status: AuthStatus) {
    this.loading = false;
    if (status === AuthStatus.Success) this.navigator.goBack('');
  }
}
