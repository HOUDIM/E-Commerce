import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalPages = 0;
  pageSize = 12;

  // Filtres
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      category: this.selectedCategory,
      search: this.searchTerm
    };

    this.productService.getAllProducts(params).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        this.toastr.error(this.error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }
}
