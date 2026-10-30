import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // <-- Adicionado
  ) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/bookings/my-bookings').subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
        this.cdr.detectChanges(); // <-- Força o Angular a atualizar a tela
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar suas reservas.';
        this.loading = false;
        this.cdr.detectChanges(); // <-- Força a atualização mesmo com erro
      }
    });
  }
}