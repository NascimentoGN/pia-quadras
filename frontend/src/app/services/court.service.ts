import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private apiUrl = 'http://localhost:3000/api/courts';
  private bookingUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) { }

  getCourts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.bookingUrl, bookingData);
  }
}