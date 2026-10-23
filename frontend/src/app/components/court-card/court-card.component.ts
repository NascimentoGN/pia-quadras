import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-court-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './court-card.component.html',
  styleUrl: './court-card.component.css'
})
export class CourtCardComponent {
  @Input() court: any;
  @Input() isMostBooked: boolean = false;
  @Output() selecionar = new EventEmitter<any>(); 
}