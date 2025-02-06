import { Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../shared/models/product.model';
import { OnInit } from '@angular/core';



// src/app/features/home/home.component.ts
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  categories: any[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const [featured, newArrivals, categories] = await Promise.all([
        this.productService.getFeaturedProducts().toPromise(),
        this.productService.getNewArrivals().toPromise(),
        this.categoryService.getCategories().toPromise()
      ]);

      this.featuredProducts = featured || [];
      this.newArrivals = newArrivals || [];
      this.categories = categories || [];
    } finally {
      this.loading = false;
    }
  }
}
