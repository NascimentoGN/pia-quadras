import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { CourtCardComponent } from '../../components/court-card/court-card.component';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal.component';
import { AboutModalComponent } from '../../components/about-modal/about-modal.component';
import { CourtService } from '../../services/court.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, CourtCardComponent, BookingModalComponent, AboutModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  courts: any[] = [];
  filteredCourts: any[] = [];
  
  searchTerm: string = '';
  selectedType: string = 'all';
  
  courtTypes = [
    { value: 'all', label: 'Todas' },
    { value: 'society', label: 'Society' },
    { value: 'areia', label: 'Areia' },
    { value: 'tenis', label: 'Tênis' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'basquete', label: 'Basquete' },
    { value: 'volei', label: 'Vôlei' }
  ];

  quadraSelecionada: any = null;
  isAboutOpen = false;

  constructor(private courtService: CourtService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts = data;
        this.filteredCourts = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na API:', err);
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.filteredCourts = this.courts.filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || court.type === this.selectedType;
      
      return matchesSearch && matchesType;
    });
  }

  selectType(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  abrirModal(court: any) {
    this.quadraSelecionada = court;
  }

  fecharModal() {
    this.quadraSelecionada = null;
  }

  abrirSobre() { this.isAboutOpen = true; }
  fecharSobre() { this.isAboutOpen = false; }
}