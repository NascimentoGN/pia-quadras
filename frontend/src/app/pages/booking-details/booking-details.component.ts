import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './booking-details.component.html'
})
export class BookingDetailsComponent implements OnInit {
  booking: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // <-- Adicionado
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.http.get<any>(`http://localhost:3000/api/bookings/${id}`).subscribe({
      next: (data) => {
        console.log('Dados recebidos com sucesso:', data);
        this.booking = data;
        this.loading = false;
        this.cdr.detectChanges(); // <-- Força a tela a atualizar
      },
      error: (err) => {
        console.error('Erro na API:', err);
        this.errorMessage = err.error?.error || 'Erro ao carregar detalhes.';
        this.loading = false;
        this.cdr.detectChanges(); // <-- Força a tela a atualizar
      }
    });
  }
}