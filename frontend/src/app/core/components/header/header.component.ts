import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  cart: Cart | null = null;
  showMiniCart = false;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  toggleMiniCart(): void {
    this.showMiniCart = !this.showMiniCart;
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        // Le cart$ observable mettra automatiquement à jour l'interface
      }
    });
  }

  goToCheckout(): void {
    this.showMiniCart = false;
    this.router.navigate(['/checkout']);
  }

  goToCart(): void {
    this.showMiniCart = false;
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}