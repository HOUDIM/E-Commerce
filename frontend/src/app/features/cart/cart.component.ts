import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from '../../shared/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  loading: boolean = true;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement du panier');
        this.loading = false;
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      this.toastr.warning('Quantité non disponible en stock');
      return;
    }

    this.cartService.updateQuantity(item.product._id, newQuantity).subscribe({
      next: () => {
        this.toastr.success('Quantité mise à jour');
      },
      error: (error) => {
        this.toastr.error('Erreur lors de la mise à jour de la quantité');
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.toastr.success('Article retiré du panier');
      },
      error: (error) => {
        this.toastr.error('Erreur lors de la suppression de l\'article');
      }
    });
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.toastr.success('Panier vidé avec succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression du panier');
        }
      });
    }
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}