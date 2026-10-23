import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { CourtCardComponent } from '../../components/court-card/court-card.component';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal.component';
import { CourtService } from '../../services/court.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CourtCardComponent, BookingModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  courts: any[] = [];
  quadraSelecionada: any = null; 

  constructor(private courtService: CourtService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na API:', err);
        this.cdr.detectChanges();
      }
    });
  }

  abrirModal(court: any) {
    console.log('Clicou na quadra:', court); // Verifique no console F12 se isso aparece
    this.quadraSelecionada = court;
  }

  fecharModal() {
    this.quadraSelecionada = null;
  }
}