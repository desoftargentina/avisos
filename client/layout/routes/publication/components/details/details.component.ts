import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map, tap, switchMap } from 'rxjs/operators';
import { Publish } from 'api';
import { Observable, Subscription } from 'rxjs';
import { PublicationService } from 'client/services';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit, OnDestroy {
  private publishSubscription: Subscription;
  @Input() publish: Observable<Publish>;

  loading = true;
  description: SafeHtml;

  path: string;

  constructor(private publishService: PublicationService, private sanitizier: DomSanitizer) {}

  ngOnInit() {
    this.publishSubscription = this.publish
      .pipe(
        switchMap(publish => this.publishService.getDescription(publish.id)),
        map(unsafe => this.sanitizier.bypassSecurityTrustHtml(unsafe)),
        tap(_ => (this.loading = false))
      )
      .subscribe(data => (this.description = data));
  }

  ngOnDestroy() {
    this.publishSubscription.unsubscribe();
  }
}
