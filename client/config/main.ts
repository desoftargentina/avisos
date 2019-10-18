import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { LayoutModule } from 'client/layout/layout.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(LayoutModule)
  .catch(err => console.error(err));
