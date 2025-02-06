import { CanActivateFn, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


export const adminGuard: CanActivateFn = (route, state) => {
  return true;
};

// src/app/core/guards/admin.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
