import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// src/app/core/services/category.service.ts
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}