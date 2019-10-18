import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { category_list, Category, Subcategory, subcategory_list } from 'api';
@Component({
  selector: 'category-selector',
  templateUrl: './category-selector.component.html'
})
export class CategorySelectorComponent implements OnInit {

  @Input() required: boolean;

  categoryForm = this.fb.group({
    category: [''],
    subcategory: ['']
  });

  constructor(private fb: FormBuilder) {
    this.categoryForm.get('category').valueChanges.subscribe(category => {
      if (!category) return;
      const childs = category_list[category].childs;
      if (childs.length == 1) this.categoryForm.get('subcategory').setValue(childs[0]);
    });
  }

  ngOnInit() {
    this.required = this.required || typeof this.required === 'string';
  }

  public get categoryKeys(): string[] {
    return Object.keys(category_list);
  }

  public get subcategoryKeys(): number[] {
    if (this.category) return this.category.childs;
  }

  getCategory(key: string): Category {
    return category_list[key];
  }

  getSubcategory(key: number): Subcategory {
    return subcategory_list['' + key];
  }

  public get category(): Category {
    return category_list[this.categoryForm.get('category').value];
  }

  public get subcategory(): Subcategory {
    return subcategory_list[this.categoryForm.get('subcategory').value];
  }
}
