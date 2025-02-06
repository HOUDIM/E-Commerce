import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { CoreModule } from './core/core.module';
//import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { LoginComponent } from './features/auth/login/login.component';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/orders/order-confirmation/order-confirmation.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { StripePaymentComponent } from './features/checkout/stripe-payment/stripe-payment.component';
import { HomeComponent } from './features/home/home.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { CategoryAdminComponent } from './features/admin/categories/category-admin/category-admin.component';
import { ProductAdminComponent } from './features/admin/products/product-admin/product-admin.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderConfirmationComponent,
    HeaderComponent,
    FooterComponent,
    ClickOutsideDirective,
    StripePaymentComponent,
    HomeComponent,
    ProductCardComponent,
    CategoryListComponent,
    CategoryAdminComponent,
    ProductAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    //CoreModule,
    //SharedModule
    CommonModule,
    ToastrModule.forRoot(),
    FormsModule,
    
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ClickOutsideDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
