import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTree } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SearchService } from '../../search.service';
import { category_list, subcategory_list } from 'api';
import { FormBuilder, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { tap, switchMap } from 'rxjs/operators';

//#region Interfaces
interface FilterNode {
  name: string;
  items?: FilterNode[];
  query?: {
    name: string;
    value: any;
  };
  thin?: boolean;
  first?: boolean;
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  query?: {
    name: string;
    value: any;
  };
  thin?: boolean;
  first: boolean;
}

interface Tag {
  name: string;
  query: string | string[];
}

interface PriceTag {
  name: string;
  min?: number;
  max?: number;
}
//#endregion

//#region Validators
const rangeValidator: ValidatorFn = (control: FormGroup) => {
  const min = control.get('min');
  const max = control.get('max');
  return min.value && max.value && min.value > max.value ? { invalidRange: true } : null;
};
//#endregion

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements AfterViewInit {
  //#region Getters
  get prices() {
    return this.priceForm.controls;
  }
  //#endregion

  constructor(private route: ActivatedRoute, search: SearchService, private router: Router, private fb: FormBuilder) {
    this.updateTree();
    route.queryParamMap
      .pipe(
        tap(params => this.updateTags(params)),
        tap(params => this.updateFilters(params)),
        tap(params => this.updatePriceFilter(params))
      )
      .subscribe(_ => this.updateTree());
    search.params.pipe(switchMap(() => search.getPriceRange())).subscribe(range => this.updatePriceRange(range));
  }

  //#region Mat Tree Variables
  treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.items
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  //#endregion

  //#region Variables
  tags: Tag[];

  @ViewChild(MatTree, { static: true }) tree: MatTree<FlatNode>;

  filters: FilterNode[] = [];
  priceTags: { name: string; min?: number; max?: number }[] = [];
  priceForm = this.fb.group(
    {
      min: ['', [Validators.min(0)]],
      max: ['', [Validators.min(0)]]
    },
    { validator: rangeValidator }
  );
  //#endregion

  //#region Material Tree Releated

  private transformer(node: FilterNode, level: number) {
    return {
      expandable: !!node.items && node.items.length > 0,
      query: node.query,
      name: node.name,
      thin: node.thin,
      level: level,
      first: node.first
    };
  }
  ngAfterViewInit = () => this.tree.treeControl.expandAll();
  hasChild = (_: number, node: FlatNode) => node.expandable;

  updateTree() {
    if (this.filters && this.filters.length > 0) this.filters[0].first = true;
    this.dataSource.data = this.filters;
    if (this.tree) this.tree.treeControl.expandAll();
  }
  //#endregion

  //#region Tags
  updateTags(params: ParamMap) {
    this.tags = [];
    if (params.has('from'))
      if (params.has('to'))
        this.tags.push({
          name: '$'
            .concat(params.get('from'))
            .concat(' a $')
            .concat(params.get('to')),
          query: ['from', 'to']
        });
      else
        this.tags.push({
          name: 'Más de $'.concat(params.get('from')),
          query: 'from'
        });
    else if (params.has('to'))
      this.tags.push({
        name: 'Hasta $'.concat(params.get('to')),
        query: 'to'
      });

    if (params.has('subcategory')) {
      const id = +params.get('subcategory');
      const res = Object.values(subcategory_list).find(el => el.id === id);
      if (res)
        this.tags.push({
          name: res.name,
          query: ['subcategory', '' + res.category]
        });
    } else if (params.has('category')) {
      const id = +params.get('category');
      const res = Object.values(category_list).find(el => el.id === id);
      if (res)
        this.tags.push({
          name: res.name,
          query: 'category'
        });
    }

    if (params.has('condition'))
      this.tags.push({
        name: params.get('condition') === 'true' ? 'Nuevo' : 'Usado',
        query: 'condition'
      });

    if (params.has('query'))
      this.tags.push({
        name: params.get('query').replace(/-/g, ' '),
        query: 'query'
      });
  }

  removeTag(tag: Tag) {
    const currentParams = this.route.snapshot.queryParamMap;
    const params = {};
    for (const key of currentParams.keys) params[key] = currentParams.get(key);

    if (tag.query instanceof Array) {
      if (tag.query[0] === 'subcategory') {
        params['subcategory'] = undefined;
        params['category'] = tag.query[1];
      } else for (const query of tag.query) params[query] = undefined;
    } else params[tag.query] = undefined;

    this.router.navigate(['/search'], { queryParams: params });
  }
  //#endregion

  //#region Generic Filters
  updateFilters(params: ParamMap) {
    this.filters = [];

    if (!params.has('category')) {
      if (!params.has('subcategory')) this.addCategoriesFilter();
    } else if (!params.has('subcategory')) this.addSubcategoriesFilter(+params.get('category'));
    if (!params.has('condition')) this.addConditionFilter();
  }

  addCategoriesFilter() {
    const node: FilterNode = { name: 'Categorías', items: [] };
    for (const category of Object.values(category_list))
      node.items.push({
        name: category.name,
        query: {
          name: 'category',
          value: category.id
        },
        thin: true
      });
    this.filters.push(node);
  }

  addSubcategoriesFilter(category: number) {
    const res = Object.values(category_list).find(el => el.id === category);
    if (res && res.childs) {
      const node: FilterNode = { name: 'Subcategorías', items: [] };
      for (const subId of res.childs) {
        const subcategory = subcategory_list[subId];
        node.items.push({
          name: subcategory.name,
          query: {
            name: 'subcategory',
            value: subcategory.id
          },
          thin: true
        });
      }
      this.filters.push(node);
    }
  }

  addConditionFilter() {
    this.filters.push({
      name: 'Condición',
      items: [
        {
          name: 'Nuevo',
          query: { name: 'condition', value: true }
        },
        {
          name: 'Usado',
          query: { name: 'condition', value: false }
        }
      ]
    });
  }

  redirect(node: FilterNode) {
    const currentParams = this.route.snapshot.queryParamMap;
    const params = {};
    for (const key of currentParams.keys) params[key] = currentParams.get(key);
    params[node.query.name] = node.query.value;

    this.router.navigate(['/search'], { queryParams: params });
  }
  //#endregion

  //#region Price Tags
  truncatePrice(price: number, width: number): number {
    return width >= 1000 ? Math.round(price / 100) * 100 : Math.round(price / 50) * 50;
  }

  addPriceTag(min?: number, max?: number) {
    this.priceTags.push({
      name: min ? (max ? `$${min} a $${max}` : `Desde $${min}`) : max ? `Hasta $${max}` : '',
      min: min ? (min > 0 ? min : undefined) : undefined,
      max: max ? (max > 0 ? max : undefined) : undefined
    });
  }

  updatePriceRange(range: { min: number; max: number }) {
    this.priceTags = [];
    const fMin: number | undefined = this.prices['min'].value,
      fMax: number | undefined = this.prices['max'].value;
    const max = fMax && fMax > range.min ? fMax : range.max,
      min = fMin && fMin > 0 ? fMin : range.min;
    const width = max - min;
    if (width >= 100) {
      const half = this.truncatePrice(min + width / 2, width);
      if (width >= 200) {
        const quarter = this.truncatePrice(min + width / 4, width / 2);
        this.addPriceTag(fMin, quarter);
        this.addPriceTag(quarter, half);
      } else this.addPriceTag(fMin, half);
      this.addPriceTag(half, fMax);
    }
  }

  onPriceTag(tag: PriceTag) {
    const currentParams = this.route.snapshot.queryParamMap,
      params = {};
    for (const key of currentParams.keys) params[key] = currentParams.get(key);
    if (tag.min) params['from'] = '' + tag.min;
    if (tag.max) params['to'] = '' + tag.max;
    this.router.navigate(['/search'], { queryParams: params });
  }
  //#endregion

  //#region Price Filter

  updatePriceFilter(params: ParamMap) {
    if (params.has('from')) this.prices['min'].setValue(+params.get('from'));
    else this.prices['min'].reset();
    if (params.has('to')) this.prices['max'].setValue(+params.get('to'));
    else this.prices['max'].reset();
  }

  filterPrices() {
    if (this.priceForm.invalid) return;
    const currentParams = this.route.snapshot.queryParamMap;
    const params = {};
    for (const key of currentParams.keys) params[key] = currentParams.get(key);
    params['from'] = this.prices['min'].value;
    params['to'] = this.prices['max'].value;

    this.router.navigate(['/search'], { queryParams: params });
  }

  onlyNumberKey(event) {
    const charCode = event.query ? event.query : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }
  //#endregion
}
