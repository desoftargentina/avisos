import { Component } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

interface EntryNode {
  name: string;
  url?: string;
  params?: any;
  children?: EntryNode[];
}

const TREE_DATA: EntryNode[] = [
  {
    name: 'Publicaciones',
    url: 'publications',
    children: [
      { name: 'Todos', url: 'publications' },
      { name: 'En espera', url: 'publications', params: { status: 0x1 } },
      { name: 'Normales', url: 'publications', params: { status: 0x2 } },
      { name: 'Pausados', url: 'publications', params: { status: 0x4 } },
      { name: 'Finalizados', url: 'publications', params: { status: 0x8 } }
    ]
  },
  {
    name: 'Seguridad',
    url: 'users',
    children: [
      { name: 'Todos', url: 'users' },
      { name: 'Administradores', url: 'users', params: { status: 0x1 } },
      { name: 'Usuarios', url: 'users', params: { status: 0x2 } },
      { name: 'VIPs', url: 'users', params: { status: 0x4 } }
    ]
  }
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  url?: string;
  params?: string;
}

@Component({
  selector: 'admin-navbar',
  templateUrl: './navbar.component.html',
  styles: ['.slow-hide { transition: height 2s }']
})
export class NavbarComponent {
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

    res.url = node.url;
    res.params = node.params;

    return res;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
