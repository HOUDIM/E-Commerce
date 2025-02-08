import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface User {
 _id: string;
 email: string;
 role: string;
}

interface AuthResponse {
 token: string;
 user: User;
}

@Injectable({
 providedIn: 'root'
})
export class AuthService {
 private readonly API_URL = `${environment.apiUrl}/auth`;
 private readonly TOKEN_KEY = 'token';
 private readonly USER_KEY = 'user';

 private authState = new BehaviorSubject<boolean>(this.isTokenValid());
 private userRole = new BehaviorSubject<string>(this.getCurrentUserRole());

 public authState$ = this.authState.asObservable();
 public userRole$ = this.userRole.asObservable();

 constructor(private http: HttpClient) {
   this.initAuthState();
 }

 private initAuthState(): void {
   this.authState.next(this.isTokenValid());
   this.userRole.next(this.getCurrentUserRole());
 }

 public register(userData: Partial<User>): Observable<AuthResponse> {
   return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
     tap(this.handleAuthSuccess.bind(this))
   );
 }

 public login(credentials: { email: string; password: string }): Observable<AuthResponse> {
   return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
     tap(this.handleAuthSuccess.bind(this))
   );
 }

 public logout(): void {
   localStorage.removeItem(this.TOKEN_KEY);
   localStorage.removeItem(this.USER_KEY);
   this.authState.next(false);
   this.userRole.next('');
 }

 public isAuthenticated(): boolean {
   return this.isTokenValid();
 }

 public isAdmin(): boolean {
   return this.getCurrentUserRole() === 'admin';
 }

 public getCurrentUser(): User | null {
   const userStr = localStorage.getItem(this.USER_KEY);
   return userStr ? JSON.parse(userStr) : null;
 }

 public getCurrentUserId(): string {
   return this.getCurrentUser()?._id ?? '';
 }

 private handleAuthSuccess(response: AuthResponse): void {
   localStorage.setItem(this.TOKEN_KEY, response.token);
   localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
   this.authState.next(true);
   this.userRole.next(response.user.role);
 }

 private isTokenValid(): boolean {
   const token = localStorage.getItem(this.TOKEN_KEY);
   return !!token; // Add token expiration check if needed
 }

 private getCurrentUserRole(): string {
   return this.getCurrentUser()?.role ?? '';
 }
}