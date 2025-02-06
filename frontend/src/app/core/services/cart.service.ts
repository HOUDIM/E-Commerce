import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  // Getter pour obtenir le cart comme Observable
  get cart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  // Charger le panier depuis le localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  // Sauvegarder le panier dans le localStorage
  private saveCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  // Ajouter un produit au panier
  addToCart(cartItem: CartItem): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, cartItem).pipe(
      map(response => {
        const currentCart = this.cartSubject.value;
        const existingItemIndex = currentCart.items.findIndex(
          item => item.product._id === cartItem.product._id
        );

        if (existingItemIndex > -1) {
          currentCart.items[existingItemIndex].quantity += cartItem.quantity;
        } else {
          currentCart.items.push(cartItem);
        }

        this.updateCartTotals(currentCart);
        this.saveCart(currentCart);
        return currentCart;
      })
    );
  }

  // Mettre à jour la quantité d'un produit
  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update`, { productId, quantity }).pipe(
      map(response => {
        const currentCart = this.cartSubject.value;
        const itemIndex = currentCart.items.findIndex(
          item => item.product._id === productId
        );

        if (itemIndex > -1) {
          currentCart.items[itemIndex].quantity = quantity;
          this.updateCartTotals(currentCart);
          this.saveCart(currentCart);
        }

        return currentCart;
      })
    );
  }

  // Supprimer un produit du panier
  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`).pipe(
      map(response => {
        const currentCart = this.cartSubject.value;
        currentCart.items = currentCart.items.filter(
          item => item.product._id !== productId
        );
        
        this.updateCartTotals(currentCart);
        this.saveCart(currentCart);
        return currentCart;
      })
    );
  }

  // Vider le panier
  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/clear`).pipe(
      map(response => {
        const emptyCart: Cart = {
          items: [],
          totalItems: 0,
          totalPrice: 0
        };
        this.saveCart(emptyCart);
        return emptyCart;
      })
    );
  }

  // Mettre à jour les totaux du panier
  private updateCartTotals(cart: Cart): void {
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity, 
      0
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }

  // Vérifier si un produit est dans le panier
  isInCart(productId: string): boolean {
    return this.cartSubject.value.items.some(
      item => item.product._id === productId
    );
  }

  // Obtenir la quantité d'un produit dans le panier
  getItemQuantity(productId: string): number {
    const item = this.cartSubject.value.items.find(
      item => item.product._id === productId
    );
    return item ? item.quantity : 0;
  }

  // Vérifier la disponibilité du stock
  checkStockAvailability(productId: string, requestedQuantity: number): Observable<boolean> {
    return this.http.get<{available: boolean}>(
      `${this.apiUrl}/check-stock/${productId}/${requestedQuantity}`
    ).pipe(
      map(response => response.available)
    );
  }

  // Synchroniser le panier avec le serveur
  syncCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/sync`, {
      items: this.cartSubject.value.items
    }).pipe(
      map(response => {
        this.saveCart(response);
        return response;
      })
    );
  }
}