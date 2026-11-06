import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Adicionado
import { HeaderComponent } from '../../components/header/header.component';
import { ReviewService } from '../../services/review.service'; // <-- Adicionado
import { ToastService } from '../../services/toast.service'; // <-- Adicionado

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FormsModule],
  templateUrl: './booking-details.component.html'
})
export class BookingDetailsComponent implements OnInit {
  booking: any = null;
  loading = true;
  errorMessage = '';

  // Variáveis da Avaliação
  rating: number = 5;
  comment: string = '';
  isSubmittingReview = false;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`http://localhost:3000/api/bookings/${id}`).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na API:', err);
        this.errorMessage = err.error?.error || 'Erro ao carregar detalhes.';
        this.loading = false;
      }
    });
  }

  submitReview() {
    if (!this.booking) return;

    this.isSubmittingReview = true;
    const reviewData = {
      booking_id: this.booking.id,
      court_id: this.booking.court_id,
      rating: this.rating,
      comment: this.comment
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.toastService.success('Avaliação enviada com sucesso! Obrigado!');
        this.isSubmittingReview = false;
        // Opcional: recarregar a página ou esconder o formulário
        this.booking.status = 'completed'; // Simula que a reserva foi concluída
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingReview = false;
        this.toastService.error(err.error?.error || 'Erro ao enviar avaliação.');
      }
    });
  }
}