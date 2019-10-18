import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { Publish, currencies, tag_list, tagType, Tag, IUserPreview } from 'api';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styles: ['.title-holder{height:calc(1.2em + 1.5rem)}']
})
export class ContactComponent implements OnInit, OnDestroy, OnChanges {
  private sub: Subscription;
  @Input() publish: Observable<Publish>;

  @ViewChild('titleRef', { static: true }) titleEl: ElementRef;
  @ViewChild('titleHolder', { static: false }) holderEl: ElementRef;
  titleUpdated = false;

  /* General */
  title: string;
  price: number;
  currency: string;

  /* Location */
  gpsSub: Subject<number> = new Subject();

  /* Tags */
  tags: Tag[] = [];

  /* Other */
  views: number;
  isEnding: boolean;
  daysLeft: number;

  /* Publisher */
  sellerSub: Subject<IUserPreview> = new Subject();
  sellerACode?: number;
  sellerPhone?: number;

  ngOnInit() {
    this.sub = this.publish.subscribe(publish => {
      /* General */
      this.title = publish.name;
      this.price = publish.price;
      this.currency = currencies[publish.currency].code;

      /* Location */
      this.gpsSub.next(publish.gps);

      /* Tags */
      if (publish.publisher.isPremium) this.tags.push(tag_list[tagType.Premium]);
      if (publish.isNew) this.tags.push(tag_list[tagType.New]);
      if (publish.isFresh) this.tags.push(tag_list[tagType.Fresh]);
      if (publish.isEnding) this.tags.push(tag_list[tagType.Ending]);
      if (publish.isTrending) this.tags.push(tag_list[tagType.Trending]);
      if (publish.publisher.isTrusted) this.tags.push(tag_list[tagType.Trusted]);

      this.tags.sort((a, b) => a.order - b.order);

      /* Other */
      this.views = publish.views;
      this.daysLeft = publish.daysLeft;
      this.isEnding = publish.isEnding;

      /* User */
      this.sellerSub.next({
        id: publish.publisher.id,
        name: publish.publisher.name,
        gps: publish.publisher.gps,
        isPremium: publish.publisher.isPremium,
        isTrusted: publish.publisher.isTrusted,
        publications: publish.publisher.publications
      });

      this.sellerACode = publish.publisher.area_code;
      this.sellerPhone = publish.publisher.cellphone;
    });
  }

  ngOnChanges() {
    if (!this.titleUpdated && this.titleEl.nativeElement.offsetHeight) {
      this.titleUpdated = true;
      const maxHeight = this.holderEl.nativeElement.offsetHeight;
      const height = this.titleEl.nativeElement.offsetHeight;
      if (height > maxHeight) {
        const lineHeight = this.titleEl.nativeElement.style.lineHeight;
        this.titleEl.nativeElement.style.lineHeight = '20px';
        const lines = this.titleEl.nativeElement.offsetHeight / 20;
        this.titleEl.nativeElement.style.fontSize = Number(maxHeight) / (1.2 * lines) + 'px';
        this.titleEl.nativeElement.style.lineHeight = lineHeight;
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  get seller() {
    return this.sellerSub.asObservable();
  }

  get gps() {
    return this.gpsSub.asObservable();
  }
}
