import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cart } from '../../shared/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cart: Cart | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  private cartSubscription: Subscription = new Subscription();

  paymentMethods = [
    { id: 'card', name: 'Carte bancaire', icon: 'bi-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'bi-paypal' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
        country: ['FR', Validators.required]
      }),
      paymentMethod: ['card', Validators.required],
      saveInfo: [false]
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        if (!cart || cart.items.length === 0) {
          this.toastr.warning('Votre panier est vide');
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement du panier');
      }
    });
  }

  async onSubmit() {
    if (this.checkoutForm.invalid || !this.cart) {
      this.toastr.error('Veuillez remplir tous les champs correctement');
      return;
    }

    this.submitting = true;

    try {
      const orderData = {
        ...this.checkoutForm.value,
        items: this.cart.items,
        totalAmount: this.cart.totalPrice
      };

      if (this.checkoutForm.value.paymentMethod === 'card') {
        const paymentResult = await this.checkoutService.processCardPayment(orderData);
        if (paymentResult.success) {
          await this.finalizeOrder(orderData);
        }
      } else if (this.checkoutForm.value.paymentMethod === 'paypal') {
        await this.checkoutService.processPayPalPayment(orderData);
      }
    } catch (error) {
      this.toastr.error('Erreur lors du traitement du paiement');
      this.submitting = false;
    }
  }

  private async finalizeOrder(orderData: any) {
    try {
      await this.checkoutService.createOrder(orderData);
      await this.cartService.clearCart().toPromise();
      this.toastr.success('Commande effectuée avec succès');
      this.router.navigate(['/order-confirmation']);
    } catch (error) {
      this.toastr.error('Erreur lors de la finalisation de la commande');
    } finally {
      this.submitting = false;
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}