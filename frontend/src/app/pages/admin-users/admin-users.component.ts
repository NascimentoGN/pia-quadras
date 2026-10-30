import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erro ao carregar usuários.');
        this.loading = false;
      }
    });
  }
}