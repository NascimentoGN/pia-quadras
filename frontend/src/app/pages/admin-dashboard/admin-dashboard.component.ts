import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  errorMessage = '';
  
  // Variáveis do Modal de Confirmação
  bookingToAction: any = null;
  actionType: 'confirmed' | 'cancelled' | null = null;

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService // <-- Injetado
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/bookings/admin/all').subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'Acesso negado ou erro ao carregar.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Abre o modal para confirmar a ação
  askUpdateStatus(booking: any, newStatus: string) {
    this.bookingToAction = booking;
    this.actionType = newStatus as 'confirmed' | 'cancelled';
  }

  // Executa a ação após o usuário confirmar no modal
  executeUpdateStatus() {
    if (!this.bookingToAction || !this.actionType) return;

    this.http.put(`http://localhost:3000/api/bookings/${this.bookingToAction.id}/status`, { status: this.actionType }).subscribe({
      next: () => {
        this.toastService.success('Status atualizado com sucesso!');
        this.loadBookings();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar o status.');
        console.error(err);
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.bookingToAction = null;
    this.actionType = null;
  }
}