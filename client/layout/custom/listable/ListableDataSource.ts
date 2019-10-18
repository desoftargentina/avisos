import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, from, merge } from 'rxjs';
import { ListableService } from './listable.service';
import { ListQuerier, ListFilters } from './types';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export class ListableDataSource<T> implements DataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  private paginator: MatPaginator;
  private sort: MatSort;

  get pageIndex() {
    return this.paginator ? this.paginator.pageIndex : 0;
  }

  get pageSize() {
    return this.paginator ? this.paginator.pageSize : 10;
  }

  get sortColumn() {
    return this.sort ? this.sort.active : this.defSortColumn;
  }

  get sortDirection() {
    return this.sort ? this.sort.direction : 'asc';
  }

  public loading = this.loadingSubject.asObservable();
  private _filters: ListFilters = {};
  public get filters() {
    return this._filters;
  }
  public set filters(value: ListFilters) {
    this._filters = value;
    this.count = this.listService.count(this.url, this.filters);
  }
  public count: Observable<number> = this.listService.count(this.url, this.filters);

  constructor(private url: string, private defSortColumn: string, private listService: ListableService) {}

  initialize(paginator: MatPaginator, sort: MatSort) {
    this.sort = sort;
    this.paginator = paginator;
    sort.sortChange.subscribe(() => (paginator.pageIndex = 0));
    merge(sort.sortChange, paginator.page)
      .pipe(tap(() => this.load()))
      .subscribe();
    paginator.page.pipe(tap(() => this.load())).subscribe();
    this.load();
  }

  connect(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  load(
    querier: ListQuerier = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection
    }
  ) {
    this.loadingSubject.next(true);
    this.listService
      .list(this.url, querier, this.filters)
      .pipe(
        catchError(err => {
          console.log(err);
          return from([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(items => this.dataSubject.next(items));
  }
}
