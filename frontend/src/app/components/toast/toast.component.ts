import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast) {
      <div class="fixed top-24 right-6 z-[100] px-6 py-4 rounded-lg shadow-2xl font-bold text-white transition-all transform translate-y-0 opacity-100"
           [ngClass]="{
             'bg-green-600': toast.type === 'success',
             'bg-red-600': toast.type === 'error',
             'bg-blue-600': toast.type === 'info'
           }">
        {{ toast.text }}
      </div>
    }
  `
})
export class ToastComponent implements OnInit {
  toast: ToastMessage | null = null;

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(msg => {
      this.toast = msg;
      this.cdr.detectChanges();
    });
  }
}