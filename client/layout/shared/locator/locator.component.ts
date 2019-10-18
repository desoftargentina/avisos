import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { City, State, Country, countries, Gps } from 'api';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

enum Location {
  City = 'city',
  State = 'state',
  Country = 'country',
  Global = 'global'
}

@Component({
  selector: 'locator',
  templateUrl: './locator.component.html',
  styles: ['.location { cursor: pointer }', '.location:hover { text-shadow: 1px 0 0 currentColor }']
})
export class LocatorComponent implements OnInit, OnDestroy {
  @Input() gps: Observable<number>;
  sub: Subscription;

  private _vertical = false;
  @Input()
  set vertical(value) {
    this._vertical = !(typeof value === 'undefined' || value === false);
  }
  get vertical() {
    return this._vertical;
  }

  private _shoter = false;
  @Input()
  set shorter(value) {
    this._shoter = !(typeof value === 'undefined' || value === false);
  }
  get shorter() {
    return this._shoter;
  }

  background = true;
  @Input('no-background')
  set noBack(value) {
    this.background = typeof value === 'undefined' || value === false;
  }
  get noBack() {
    return !this.background;
  }

  @Input()
  size = 1;

  fontSize: number;

  Location = Location;

  global: boolean;
  city: City;
  state: State;
  country: Country;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.fontSize = this.size * 1.25;
    if (this.gps)
      this.sub = this.gps.subscribe(gps => {
        this.global = gps === 0;
        if (!this.global) {
          const locs = Gps.deserialize(gps);
          this.country = countries[locs.country];
          this.state = this.country.states[locs.state];
          this.city = this.state.cities[locs.city];
        }
      });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  redirect(event: MouseEvent, loc: Location) {
    event.stopPropagation();
    const params = {};
    if (this.route.snapshot.root.firstChild.url.map(it => it.path).join('/') === 'search') {
      const currentParams = this.route.snapshot.queryParamMap;
      for (const key of currentParams.keys) params[key] = currentParams.get(key);
    }
    params['loc'] = loc;

    if (loc !== Location.Global) {
      let code: Number;
      switch (loc) {
        case Location.City:
          code = Gps.serialize({ country: this.country.id, state: this.state.id, city: this.city.id });
          break;
        case Location.State:
          code = Gps.serialize({ country: this.country.id, state: this.state.id });
          break;
        case Location.Country:
          code = Gps.serialize({ country: this.country.id });
      }
      params['region'] = code;
    }
    this.router.navigate(['search'], { queryParams: params });
  }
}
