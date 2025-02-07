import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/core/services/order.service';



@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html'
})
export class OrderAdminComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  statusOptions = ['En attente', 'Traitement', 'Expédié', 'Livré', 'Annulé'];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement des commandes');
        this.loading = false;
      }
    });
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrder(orderId, { status: newStatus }).subscribe({
      next: () => {
        this.toastr.success('Statut mis à jour');
        this.loadOrders();
      },
      error: () => this.toastr.error('Erreur de mise à jour')
    });
  }
}
