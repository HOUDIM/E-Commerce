import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string | null = null;
  orderDetails: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de commande depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.error = 'Numéro de commande non trouvé';
        this.loading = false;
      }
    });
  }

  loadOrderDetails(): void {
    if (!this.orderId) return;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.orderDetails = order;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des détails de la commande';
        this.loading = false;
        this.toastr.error(this.error);
      }
    });
  }

  returnToHome(): void {
    this.router.navigate(['/']);
  }

  viewOrderDetails(): void {
    this.router.navigate(['/account/orders', this.orderId]);
  }
}