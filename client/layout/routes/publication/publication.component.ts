import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { Publish } from 'api';
import { Subject, iif, of, merge } from 'rxjs';
import { PublicationService, LocalAuthService } from 'client/services';

@Component({
  selector: 'publication',
  templateUrl: './publication.component.html'
})
export class PublicationComponent {
  publish: Subject<Publish> = new Subject<Publish>();

  constructor(router: Router, publishService: PublicationService, auth: LocalAuthService) {
    merge(
      router.events
        .pipe(
          filter(ev => ev instanceof NavigationEnd),
          map(ev => (ev as NavigationEnd).url)
        ),
      auth.onAuthChange
        .pipe(map(() => router.url))
    ).pipe(
      map(url => url.match('\\-\\d+$')),
      switchMap(matches =>
        // tslint:disable-next-line: deprecation
        iif(() => matches.length > 0, publishService.getDetails(+matches[0].substr(1)), of<undefined>())
      )
    ).subscribe(publish => {
      if (publish) this.publish.next(publish);
    });
  }
}
