import { Component, OnInit, Input } from '@angular/core';
import { Tag } from 'api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tagger',
  templateUrl: './tagger.component.html'
})
export class TaggerComponent implements OnInit {
  @Input()
  tag: Tag;

  name: string;
  type: number;
  class: string | undefined;
  icon: string | undefined;
  tooltip: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.name = this.tag.name;
    if (this.tag.color) this.class = 'mat-bg-'.concat(this.tag.color).concat(' mat-color-primary-contrast');
    this.icon = this.tag.icon;
    this.tooltip = this.tag.tooltip;
    this.type = this.tag.type as number;
  }

  redirect(event: MouseEvent) {
    event.stopPropagation();
    if (this.route.snapshot.root.firstChild.url.map(it => it.path).join('/') === 'search') {
      const currentParams = this.route.snapshot.queryParamMap;
      const params = {};
      for (const key of currentParams.keys) params[key] = currentParams.get(key);
      params['tag'] = this.type;
      this.router.navigate(['/search'], { queryParams: params });
    } else this.router.navigate(['search'], { queryParams: { tag: this.type } });
  }
}
