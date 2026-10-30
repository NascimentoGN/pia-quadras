import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourtService } from '../../services/court.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent {
  @Input() court: any = null;
  @Output() close = new EventEmitter<void>();

  bookingDate: string = '';
  startTime: string = '08:00';
  guestEmails: string = '';
  isLoading: boolean = false; // Controla o spinner
  
  constructor(private courtService: CourtService, private toastService: ToastService) {}

  fechar() {
    this.close.emit();
  }

  confirmarReserva() {
    if (!this.bookingDate) {
      this.toastService.error('Por favor, selecione uma data!');
      return;
    }

    this.isLoading = true; // Ativa o loading

    const emailsArray = this.guestEmails.split(',').map(e => e.trim()).filter(e => e !== '');

    const bookingData = {
      court_id: this.court.id,
      booking_date: this.bookingDate,
      start_time: this.startTime,
      end_time: this.startTime === '08:00' ? '09:00' : '10:00',
      total_price: this.court.price_per_hour,
      guest_emails: emailsArray
    };

    this.courtService.createBooking(bookingData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(`Reserva confirmada! Valor dividido: R$ ${res.amount_per_person.toFixed(2)} por pessoa.`);
        this.fechar();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          const querEntrarNaLista = confirm('Este horário já está reservado. Deseja entrar na lista de espera?');
          if (querEntrarNaLista) {
            this.entrarNaLista();
          }
        } else {
          this.toastService.error('Erro ao fazer a reserva.');
          console.error(err);
        }
      }
    });
  }

  entrarNaLista() {
    this.isLoading = true;
    const waitlistData = {
      court_id: this.court.id,
      desired_date: this.bookingDate,
      desired_start_time: this.startTime,
      desired_end_time: this.startTime === '08:00' ? '09:00' : '10:00'
    };

    this.courtService.joinWaitlist(waitlistData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(res.message);
        this.fechar();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.error || 'Erro ao entrar na lista de espera.');
        console.error(err);
      }
    });
  }
}