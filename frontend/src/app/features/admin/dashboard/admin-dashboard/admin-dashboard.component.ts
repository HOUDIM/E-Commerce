import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UserService } from 'src/app/core/services/user.service';

interface Order {
  _id: string;
  user: {
    email: string;
  };
  totalPrice: number;
  status: string;
}

interface Product {
  name: string;
  stock: number;
}

interface Statistics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
}


// src/app/features/admin/dashboard/admin-dashboard.component.ts
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  statistics:Statistics  = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: []
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    forkJoin({
      orders: this.orderService.getOrderStatistics(),
      products: this.productService.getProductStatistics(),
      customers: this.userService.getUserStatistics()
    }).subscribe(data => {
      this.statistics = { ...this.statistics, ...data };
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente': return 'warning';
      case 'Traitement': return 'info';
      case 'Expédié': return 'primary';
      case 'Livré': return 'success';
      case 'Annulé': return 'danger';
      default: return 'secondary';
    }
  }
}