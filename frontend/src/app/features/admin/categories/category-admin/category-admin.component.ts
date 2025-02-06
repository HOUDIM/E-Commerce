import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../../core/services/category.service';


// src/app/features/admin/categories/category-admin/category-admin.component.ts
@Component({
  selector: 'app-category-admin',
  templateUrl: './category-admin.component.html'
 })
 export class CategoryAdminComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  editingCategory: any = null;
  loading = false;
 
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageUrl: ['', Validators.required]
    });
  }
 
  ngOnInit() {
    this.loadCategories();
  }
 
  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement des catégories');
        this.loading = false;
      }
    });
  }
 
  onSubmit() {
    if (this.categoryForm.invalid) return;
 
    const categoryData = this.categoryForm.value;
    const operation = this.editingCategory 
      ? this.categoryService.updateCategory(this.editingCategory._id, categoryData)
      : this.categoryService.createCategory(categoryData);
 
    operation.subscribe({
      next: () => {
        this.toastr.success(`Catégorie ${this.editingCategory ? 'modifiée' : 'créée'}`);
        this.resetForm();
        this.loadCategories();
      },
      error: () => this.toastr.error('Erreur lors de l\'opération')
    });
  }
 
  editCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl
    });
  }
 
  deleteCategory(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toastr.success('Catégorie supprimée');
          this.loadCategories();
        },
        error: () => this.toastr.error('Erreur lors de la suppression')
      });
    }
  }
 
  resetForm() {
    this.editingCategory = null;
    this.categoryForm.reset();
  }
 }
