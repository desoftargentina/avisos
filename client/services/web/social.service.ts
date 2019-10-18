import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

const authConfig = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('805261846351-uq11cra6c4nbtgmcjfpchtr6b8mh1f7t.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('625006438001692', {
        scope: 'public_profile email',
        enable_profile_selector: true
      })
    }
  ]);
  
  export function provideConfig() {
    return authConfig;
  }