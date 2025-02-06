import { Component } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { OnInit } from '@angular/core';


// src/app/features/categories/category-list/category-list.component.ts
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  loading = true;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      }
    });
  }
}
