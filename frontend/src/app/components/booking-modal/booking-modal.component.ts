import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourtService } from '../../services/court.service';

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
  
  constructor(private courtService: CourtService) {}

  fechar() {
    this.close.emit();
  }

  confirmarReserva() {
    if (!this.bookingDate) {
      alert('Por favor, selecione uma data!');
      return;
    }

    const bookingData = {
      court_id: this.court.id,
      booking_date: this.bookingDate,
      start_time: this.startTime,
      end_time: this.startTime === '08:00' ? '09:00' : '10:00',
      total_price: this.court.price_per_hour
    };

    this.courtService.createBooking(bookingData).subscribe({
      next: (res) => {
        alert(`Reserva confirmada com sucesso para o dia ${this.bookingDate}!`);
        this.fechar();
      },
      error: (err) => {
        console.error('Erro na API:', err);
        if (err.status === 409) {
          alert('Ops! Este horário já está reservado. Por favor, escolha outro.');
        } else {
          alert('Erro ao fazer a reserva. Verifique o console.');
        }
      }
    });
  }
}