import { Component, OnInit } from '@angular/core';
import { Category, category_list } from 'api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];

  ngOnInit() {
    this.categories = Object.values(category_list).sort((a, b) => a.id - b.id);
  }

  contentFits() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    return !this.mobile() && aspectRatio < 0.3666 + 0.00133 * window.innerWidth;
  }

  mobile = () => window.innerWidth <= 576;
}
