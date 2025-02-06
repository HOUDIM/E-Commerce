import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Product } from '../../../../shared/models/product.model';
import { OnInit } from '@angular/core';


// src/app/features/admin/products/product-admin/product-admin.component.ts
@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  editingProduct: any = null;
  categories: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      brand: ['', Validators.required]
    });
  }

  private loadData() {
    this.loading = true;
    forkJoin({
      products: this.productService.getAllProducts(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (data) => {
        this.products = data.products;
        this.categories = data.categories;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;
    const operation = this.editingProduct 
      ? this.productService.updateProduct(this.editingProduct._id, productData)
      : this.productService.createProduct(productData);

    operation.subscribe({
      next: () => {
        this.toastr.success(`Produit ${this.editingProduct ? 'modifié' : 'créé'}`);
        this.resetForm();
        this.loadData();
      },
      error: () => this.toastr.error('Erreur lors de l\'opération')
    });
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Produit supprimé');
          this.loadData();
        },
        error: () => this.toastr.error('Erreur lors de la suppression')
      });
    }
  }

  resetForm() {
    this.editingProduct = null;
    this.productForm.reset();
  }
}