import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity: number = 1;
  loading: boolean = true;
  error: string | null = null;
  isAddingToCart: boolean = false;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du produit depuis l'URL
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });

    // S'abonner aux changements du panier
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      // Vous pouvez réagir aux changements du panier ici si nécessaire
    });
  }

  loadProduct(productId: string): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du produit';
        this.loading = false;
        this.toastr.error(this.error);
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product || this.isAddingToCart) return;

    if (this.quantity > this.product.stock) {
      this.toastr.error('Quantité non disponible en stock');
      return;
    }

    this.isAddingToCart = true;

    this.cartService.addToCart({
      product: this.product,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.toastr.success('Produit ajouté au panier');
        this.isAddingToCart = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors de l\'ajout au panier');
        this.isAddingToCart = false;
        console.error('Erreur d\'ajout au panier:', error);
      }
    });
  }

  onQuantityChange(event: any): void {
    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      this.quantity = 1;
    } else if (this.product && value > this.product.stock) {
      this.quantity = this.product.stock;
      this.toastr.warning('Quantité ajustée au stock disponible');
    } else {
      this.quantity = value;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}