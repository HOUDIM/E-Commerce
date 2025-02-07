import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { OrderConfirmationComponent } from './features/orders/order-confirmation/order-confirmation.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { CategoryAdminComponent } from './features/admin/categories/category-admin/category-admin.component';
import { AdminGuard } from './core/guards/admin.guard';
import { ProductAdminComponent } from './features/admin/products/product-admin/product-admin.component';
import { HomeComponent } from './features/home/home.component';
import { OrderAdminComponent } from './features/admin/orders/order-admin/order-admin.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UsersAdminComponent } from './features/admin/users/users-admin/users-admin.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'products', 
    component: ProductListComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'cart', component: CartComponent },
  { 
    path: 'order-confirmation', 
    component: OrderConfirmationComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'categories',
    component: CategoryListComponent
  },
  {
    path: 'admin/categories',
    component: CategoryAdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/products',
    component: ProductAdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/orders',
    component: OrderAdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    component: UsersAdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
