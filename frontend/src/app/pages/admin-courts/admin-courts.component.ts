import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-courts',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './admin-courts.component.html'
})
export class AdminCourtsComponent implements OnInit {
  courts: any[] = [];
  loading = true;
  
  isModalOpen = false;
  editingCourt: any = null;
  
  formData: any = {
    name: '', type: 'society', description: '', 
    price_per_hour: 0, price_peak_hour: 0, capacity: 10, is_active: true
  };

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCourts();
  }

  // 1. ATUALIZADO PARA A ROTA ADMIN/ALL
  loadCourts() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/courts/admin/all').subscribe({
      next: (data) => {
        this.courts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar quadras.');
        this.loading = false;
      }
    });
  }

  openModal(court?: any) {
    this.isModalOpen = true;
    if (court) {
      this.editingCourt = court;
      this.formData = { ...court }; 
    } else {
      this.editingCourt = null;
      this.formData = { name: '', type: 'society', description: '', price_per_hour: 0, price_peak_hour: 0, capacity: 10, is_active: true };
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingCourt = null;
  }

  saveCourt() {
    if (this.editingCourt) {
      this.http.put(`http://localhost:3000/api/courts/${this.editingCourt.id}`, this.formData).subscribe({
        next: () => {
          this.toastService.success('Quadra atualizada!');
          this.loadCourts();
          this.closeModal();
        },
        error: () => this.toastService.error('Erro ao atualizar quadra.')
      });
    } else {
      this.http.post('http://localhost:3000/api/courts', this.formData).subscribe({
        next: () => {
          this.toastService.success('Quadra criada!');
          this.loadCourts();
          this.closeModal();
        },
        error: () => this.toastService.error('Erro ao criar quadra.')
      });
    }
  }

  deleteCourt(id: number) {
    if (!confirm('Tem certeza que deseja desativar esta quadra?')) return;
    
    this.http.delete(`http://localhost:3000/api/courts/${id}`).subscribe({
      next: () => {
        this.toastService.success('Quadra desativada!');
        this.loadCourts();
      },
      error: () => this.toastService.error('Erro ao desativar quadra.')
    });
  }

  // 2. NOVA FUNÇÃO PARA REATIVAR A QUADRA
  reactivateCourt(court: any) {
    const updatedData = { ...court, is_active: true };
    
    this.http.put(`http://localhost:3000/api/courts/${court.id}`, updatedData).subscribe({
      next: () => {
        this.toastService.success('Quadra reativada com sucesso!');
        this.loadCourts();
      },
      error: () => this.toastService.error('Erro ao reativar quadra.')
    });
  }
}