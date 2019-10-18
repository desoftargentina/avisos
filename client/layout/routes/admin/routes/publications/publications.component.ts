import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PublicationState, publication_states, ListablePublication, publishUrl, currencies } from 'api';
import { MatPaginator } from '@angular/material/paginator';
import { CategorySelectorComponent } from 'client/layout/shared';
import { ListableDataSource, ListableService } from 'client/layout/custom';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'admin-publications',
  templateUrl: './publications.component.html',
  styles: [
    `
      .m-parent {
        width: calc(100vw - 250px - 1.2rem);
        padding-right: 1rem;
      }
    `
  ]
})
export class AdminPublicationsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'time',
    'name',
    'price',
    'publisher',
    'state',
    'category',
    'subcategory',
    'duration'
  ];
  states = publication_states;
  currencies = Object.values(currencies);
  contentHeight: string;

  @ViewChild(CategorySelectorComponent, { static: false })
  categorySelector: CategorySelectorComponent;

  dataSource: ListableDataSource<ListablePublication>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filtersForm = this.fb.group({
    status: [''],
    name: [''],
    publisher: [''],
    date: this.fb.group({
      from: [new Date().toISOString()],
      to: [new Date().toISOString()]
    }),
    price: this.fb.group({
      from: [''],
      to: ['']
    }),
    currency: ['']
  });

  constructor(private fb: FormBuilder, private listService: ListableService) {
    this.dataSource = new ListableDataSource(`${publishUrl}/list/all`, 'date', this.listService);
    this.contentHeight = sessionStorage.getItem('innerContentHeight');
  }

  getStateName(state: PublicationState) {
    return PublicationState[state];
  }

  ngAfterViewInit() {
    this.dataSource.initialize(this.paginator, this.sort);

    this.filtersForm.addControl('category', this.categorySelector.categoryForm);
  }
  private buildStateMask(states?: PublicationState[]) {
    let stateMask;
    if (states) {
      stateMask = 0;
      for (const state of states)
        switch (state) {
          case PublicationState.Pendiente:
            stateMask |= 0x1;
            break;
          case PublicationState.Publicada:
            stateMask |= 0x2;
            break;
          case PublicationState.Pausada:
            stateMask |= 0x4;
            break;
          case PublicationState.Finalizada:
            stateMask |= 0x8;
            break;
        }
    }
    return stateMask;
  }
}
