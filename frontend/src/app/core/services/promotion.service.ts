import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// src/app/core/services/promotion.service.ts
@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'http://localhost:5000/api/promotions';

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPromotion(promotionData: any): Observable<any> {
    return this.http.post(this.apiUrl, promotionData);
  }

  updatePromotion(id: string, promotionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, promotionData);
  }

  deletePromotion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  validatePromoCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, { code });
  }
}
