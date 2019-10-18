import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { category_list } from 'api';
import { MatSidenav } from '@angular/material/sidenav';
import { IconName } from '@fortawesome/fontawesome-svg-core';

interface EntryNode {
  name: string;
  url?: string;
  params?: any;
  icon?: IconName;
  icon_expanded?: IconName;
  children?: EntryNode[];
}

const TREE_DATA: EntryNode[] = [];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: IconName;
  icon_expanded?: IconName;
  url?: string;
  params?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  @Input()
  sidenav: MatSidenav;

  constructor() {
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = TREE_DATA;
  }

  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<EntryNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<EntryNode, FlatNode>;
  private transformer = (node: EntryNode, level: number) => {
    const res: FlatNode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };

    res.icon = node.icon;
    res.icon_expanded = node.icon_expanded;
    res.url = node.url;
    res.params = node.params;

    return res;
  }

  ngOnInit() {
    const childs: EntryNode[] = [];
    for (const key of Object.keys(category_list)) {
      const entry = category_list[key];
      entry.url = '/search';
      entry.params = { category: entry.id };
      childs.push(entry);
    }
    const data: EntryNode[] = TREE_DATA;
    data.unshift({
      name: 'Categorias',
      icon: 'folder',
      icon_expanded: 'folder-open',
      children: childs
    });
    this.dataSource.data = data;
  }

  onRedirect() {
    this.sidenav.close();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
  icon = (node: FlatNode) : IconName =>
    node.icon_expanded && this.treeControl.isExpanded(node)
      ? node.icon_expanded
      : node.icon
      ? node.icon
      : this.treeControl.isExpanded(node)
      ? 'chevron-down'
      : 'chevron-up';
}
