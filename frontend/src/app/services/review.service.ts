import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) { }

  createReview(reviewData: any): Observable<any> {
    return this.http.post(this.apiUrl, reviewData);
  }

  getReviewsByCourt(courtId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/court/${courtId}`);
  }
}