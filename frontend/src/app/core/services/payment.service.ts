import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private stripe: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripe = loadStripe(environment.stripePublicKey);
  }

  async createPaymentIntent(orderId: string) {
    return this.http.post<{clientSecret: string}>(`${this.apiUrl}/create-intent`, { orderId }).toPromise();
  }

  async processPayment(clientSecret: string, paymentData: any) {
    const stripe = await this.stripe;
    return stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentData.card,
        billing_details: {
          name: paymentData.name,
          email: paymentData.email
        }
      }
    });
  }
}