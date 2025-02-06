import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Promise<any> {
    return this.http.post(this.apiUrl, orderData).toPromise();
  }

  processCardPayment(orderData: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/process-payment`, {
      paymentMethod: 'card',
      amount: orderData.totalAmount
    }).toPromise();
  }

  processPayPalPayment(orderData: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/process-paypal`, {
      amount: orderData.totalAmount
    }).toPromise();
  }
}
