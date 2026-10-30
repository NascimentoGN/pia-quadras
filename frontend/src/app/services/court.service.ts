import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private apiUrl = 'http://localhost:3000/api/courts';
  private bookingUrl = 'http://localhost:3000/api/bookings';
  private waitlistUrl = 'http://localhost:3000/api/waitlist';

  constructor(private http: HttpClient) { }

  // Buscar todas as quadras
  getCourts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Criar uma reserva
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.bookingUrl, bookingData);
  }

  // Entrar na lista de espera
  joinWaitlist(waitlistData: any): Observable<any> {
    return this.http.post(this.waitlistUrl, waitlistData);
  }
}