import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/core/services/promotion.service';


@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html'
})
export class PromotionsAdminComponent implements OnInit {
  promotions: any[] = [];
  promotionForm!: FormGroup;
  editingPromotion: any = null;

  constructor(
    private fb: FormBuilder,
    private promotionService: PromotionService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadPromotions();
  }

  private initForm() {
    this.promotionForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['percentage', Validators.required], 
      discountValue: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      minPurchase: [0],
      maxUses: [''],
      products: [[]]
    });
  }
 
  loadPromotions() {
    this.promotionService.getPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
      },
      error: () => this.toastr.error('Erreur de chargement des promotions')
    });
  }
 
  resetForm() {
    this.editingPromotion = null;
    this.promotionForm.reset({
      discountType: 'percentage',
      minPurchase: 0,
      products: []
    });
  }
 
  getPromotionStatus(promo: any): string {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
 
    if (now < startDate) return 'À venir';
    if (now > endDate) return 'Terminée';
    return 'Active';
  }
 
  getPromotionStatusClass(promo: any): string {
    const status = this.getPromotionStatus(promo);
    switch (status) {
      case 'Active': return 'badge bg-success';
      case 'À venir': return 'badge bg-warning';
      case 'Terminée': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  editPromotion(promo: any) {
    this.editingPromotion = promo;
    this.promotionForm.patchValue({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: promo.startDate.substring(0, 10),
      endDate: promo.endDate.substring(0, 10),
      minPurchase: promo.minPurchase,
      maxUses: promo.maxUses,
      products: promo.products
    });
   }
   
   deletePromotion(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette promotion ?')) {
      this.promotionService.deletePromotion(id).subscribe({
        next: () => {
          this.toastr.success('Promotion supprimée');
          this.loadPromotions();
        },
        error: () => this.toastr.error('Erreur lors de la suppression')
      });
    }
   }

  onSubmit() {
    if (this.promotionForm.invalid) return;
    
    const operation = this.editingPromotion
      ? this.promotionService.updatePromotion(this.editingPromotion._id, this.promotionForm.value)
      : this.promotionService.createPromotion(this.promotionForm.value);

    operation.subscribe({
      next: () => {
        this.toastr.success('Promotion sauvegardée');
        this.resetForm();
        this.loadPromotions();
      },
      error: () => this.toastr.error('Erreur lors de la sauvegarde')
    });
  }
}