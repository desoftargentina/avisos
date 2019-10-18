export interface ListCount {
  count: number;
}

export interface ListFilters {
  [param: string]: string | string[];
}

export interface ListQuerier {
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: '' | 'asc' | 'desc';
}

export function readListQuerier(url: string, querier: ListQuerier) {
  return `${url}/${querier.pageIndex}/${querier.pageSize}/${querier.sortColumn}/${querier.sortDirection}`;
}
