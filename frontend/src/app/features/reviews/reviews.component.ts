import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from 'src/app/core/services/review.service';


// src/app/features/reviews/reviews.component.ts
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: string;
  reviews: any[] = [];
  reviewForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private toastr: ToastrService
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    this.reviewService.getProductReviews(this.productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement des avis');
        this.loading = false;
      }
    });
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    this.reviewService.addReview(this.productId, this.reviewForm.value).subscribe({
      next: () => {
        this.toastr.success('Avis ajouté');
        this.reviewForm.reset();
        this.loadReviews();
      },
      error: () => this.toastr.error('Erreur lors de l\'ajout de l\'avis')
    });
  }
}