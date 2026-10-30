import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { CourtCardComponent } from '../../components/court-card/court-card.component';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal.component';
import { AboutModalComponent } from '../../components/about-modal/about-modal.component'; // <-- Importação
import { CourtService } from '../../services/court.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CourtCardComponent, BookingModalComponent, AboutModalComponent], // <-- Adicionado
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  courts: any[] = [];
  quadraSelecionada: any = null;
  isAboutOpen = false; // <-- Nova variável

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
    this.quadraSelecionada = court;
  }

  fecharModal() {
    this.quadraSelecionada = null;
  }

  // Novas funções do About
  abrirSobre() { 
    this.isAboutOpen = true; 
  }
  
  fecharSobre() { 
    this.isAboutOpen = false; 
  }
}