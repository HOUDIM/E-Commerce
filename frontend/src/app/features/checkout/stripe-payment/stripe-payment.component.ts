import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { OrderService } from '../../../core/services/order.service';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html'
})
export class StripePaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  @Input() orderId!: string; // Ajout de l'Input orderId
  @Input() amount: number = 0;

  card: any;
  stripe: any;
  paymentForm: FormGroup;
  loading = false;
  error: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }: any) => {
      this.error = error?.message || null;
    });
  }

  async onSubmit() {
    if (this.paymentForm.invalid || !this.orderId) return;

    this.loading = true;
    this.error = null;

    try {
      const response = await this.paymentService.createPaymentIntent(this.orderId);
      if (!response) throw new Error('No response from payment service');
      
      const { clientSecret } = response;
      if (!clientSecret) throw new Error('No client secret received');
  
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: this.paymentForm.get('name')?.value,
            email: this.paymentForm.get('email')?.value
          }
        }
      });

      if (result.error) {
        this.error = result.error.message;
      } else {
        // Mettre à jour le service OrderService
        await this.orderService.updateOrder(this.orderId, {
          paymentStatus: 'paid',
          paymentId: result.paymentIntent.id
        }).toPromise();

        this.router.navigate(['/order-confirmation'], {
          queryParams: { orderId: this.orderId }
        });
      }
    } catch (error) {
      this.error = 'Une erreur est survenue lors du paiement';
    } finally {
      this.loading = false;
    }
  }
}