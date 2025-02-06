import { Component, Input } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';



// src/app/shared/components/product-card/product-card.component.ts
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  addToCart() {
    this.cartService.addToCart({
      product: this.product,
      quantity: 1
    }).subscribe({
      next: () => this.toastr.success('Produit ajouté au panier'),
      error: () => this.toastr.error('Erreur lors de l\'ajout au panier')
    });
  }
}
