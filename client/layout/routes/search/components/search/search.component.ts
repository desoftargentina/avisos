import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../search.service';
import { tap, mergeMap, map } from 'rxjs/operators';
import { Preview } from 'api';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  items: Preview[];

  buffer: Preview[] = [];
  loading = false;
  closed = true;

  constructor(route: ActivatedRoute, private searchService: SearchService) {
    route.queryParams
      .pipe(
        tap(params => this.localLog(params)),
        map(params => {
          if (!params['query']) return params;
          const nParams = {};
          for (const key of Object.keys(params)) nParams[key] = params[key];
          nParams['query'] = params['query'].replace(/-/g, '');
          return nParams;
        }),
        mergeMap(params => this.searchService.setParams(params)),
        mergeMap(_ => this.searchService.getNext(2))
      )
      .subscribe(chunk => {
        this.closed = false;
        this.items = [];
        this.buffer = chunk;
      });
  }

  fetchMore(event: any) {
    if (this.closed || this.loading || event.end !== this.buffer.length - 1) return;
    if (this.buffer.length < 1) {
      this.closed = true;
      return;
    }
    this.loading = true;
    this.searchService.getNext(1).subscribe(
      chunk => {
        this.loading = false;
        if (chunk.length < 1) this.closed = true;
        else this.buffer = this.buffer.concat(chunk);
      },
      () => (this.loading = false)
    );
  }

  getUrl(item: Preview): string {
    return '/'
      .concat(item.name)
      .substr(0, 41)
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .replace(/-+$/g, '')
      .concat('.' + item.id);
  }

  private localLog(params: Params) {
    if (params['query']) {
      const query = params['query'].replace(/-/g, ' ');
      const req = localStorage.getItem('lastSearchs');
      const searchs = req == null ? [] : req.split(', ');
      if (!searchs.includes(query)) {
        searchs.unshift(query);
        if (searchs.length > 20) searchs.pop();
        localStorage.setItem('lastSearchs', searchs.join(', '));
      }
    }
  }

  @HostListener('window:beforeunload', [])
  unloadHandler = () => this.searchService.leave()
}
