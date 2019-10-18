import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchBoxService } from './search-box.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'avisos-search',
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnInit {
  searchForm = this.fb.group({ box: [''] });
  localOptions: string[] = [];
  localFilter: Observable<string[]>;
  count: number;

  asyncFilter: Observable<string[]>;

  constructor(
    private searchService: SearchBoxService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const req = localStorage.getItem('lastSearchs');
    for (const name of req == null ? [] : req.split(', ')) this.localOptions.push(name);
  }
  get control() {
    return this.searchForm.get('box');
  }

  ngOnInit() {
    this.localFilter = this.control.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filter(name) : this.localOptions)),
      map(res => {
        this.count = res.length;
        return res.slice(0, 6);
      })
    );

    this.asyncFilter = this.control.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(value => value.replace(/ /g, '')),
      switchMap(value => (this.count >= 6 ? [] : value ? this.searchService.getMatches(value, 6 - this.count) : []))
    );
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();

    return this.localOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSearch() {
    if (this.control.value || this.route.snapshot.root.firstChild.url.map(it => it.path).join('/') === 'search') {
      const params = {};
      const oldMap: ParamMap = this.route.snapshot.queryParamMap;
      for (const key of oldMap.keys) params[key] = oldMap.get(key);
      if (this.control.value) params['query'] = (this.control.value as string).replace(/ /g, '-').replace(/--+/g, '-');
      else params['query'] = undefined;
      this.router.navigate(['/search'], { queryParams: params });
    }
  }
}
