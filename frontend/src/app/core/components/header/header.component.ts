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
 isAdmin = false;
 cart: Cart | null = null;
 cartItemCount = 0;
 showMiniCart = false;
 private subscriptions = new Subscription();

 constructor(
   private authService: AuthService,
   private cartService: CartService,
   private router: Router
 ) {}

 ngOnInit(): void {
   this.initializeSubscriptions();
 }

 private initializeSubscriptions(): void {
   // Auth subscription
   this.subscriptions.add(
     this.authService.authState$.subscribe(
       isAuthenticated => {
         this.isLoggedIn = isAuthenticated;
         this.isAdmin = this.authService.isAdmin();
       }
     )
   );

   // Cart subscription
   this.subscriptions.add(
     this.cartService.cart$.subscribe(
       cart => {
         this.cart = cart;
         this.cartItemCount = cart.totalItems;
       }
     )
   );
 }

 toggleMiniCart(): void {
   this.showMiniCart = !this.showMiniCart;
 }

 removeFromCart(productId: string): void {
   this.cartService.removeFromCart(productId).subscribe();
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
   this.router.navigate(['/']);
 }

 ngOnDestroy(): void {
   this.subscriptions.unsubscribe();
 }
}