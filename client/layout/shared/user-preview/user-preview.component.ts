import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { IUserPreview, storagePath, Tag, tag_list, tagType } from 'api';
import { Observable, Subscription, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'client/services';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('card', { read: ElementRef, static: false }) card: ElementRef;

  @Input() id: Observable<number>;
  @Input() user: Observable<IUserPreview>;

  private _expandable = false;
  @Input()
  set expandable(value) {
    this._expandable = !(typeof value === 'undefined' || value === false);
  }
  get expandable() {
    return this._expandable;
  }

  @Input() direction: 'left' | 'right' = 'right';
  @Input() height: number | string;

  sub: Subscription;

  storage = storagePath;

  userID: number;
  name: string;
  gpsSub: Subject<number> = new Subject();
  tags: Tag[] = [];
  publications: number;

  hasPicture = true;

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    if (!this.user && this.id) this.user = this.id.pipe(switchMap(id => this.userSvc.getPreview(id)));
    if (this.user) this.sub = this.user.subscribe(user => this.retrieveData(user));
  }

  ngAfterViewInit() {
    if (this.height)
      this.card.nativeElement.style.height = Number(this.height) === NaN ? this.height : this.height + 'px';
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  retrieveData(user: IUserPreview) {
    if (user) {
      this.userID = user.id;
      this.name = user.name;
      this.gpsSub.next(user.gps);
      if (user.isPremium) this.tags.push(tag_list[tagType.Premium]);
      if (user.isTrusted) this.tags.push(tag_list[tagType.Trusted]);
      this.publications = user.publications;
      this.hasPicture = true;
    }
  }

  get gps() {
    return this.gpsSub.asObservable();
  }
}
