import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '@app/shared/models/quote.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createQuote(quote: Quote): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}${environment.endpoints.createQuote}`, quote);
  }

  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}${environment.endpoints.listAllQuotes}`);
  }

  getQuoteById(id: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}${environment.endpoints.getQuoteById}/${id}`);
  }

  getQuotesByUser(userId: string): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}${environment.endpoints.getQuotesByUser}/${userId}`);
  }

  updateQuoteStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}${environment.endpoints.updateQuoteStatus}/${id}`, { status });
  }

  updateQuoteDate(id: string, date: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}${environment.endpoints.updateQuoteDate}/${id}`, { date });
  }

  addNoteToQuote(id: string, note: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}${environment.endpoints.addNoteToQuote}/${id}`, { note });
  }

  addAttachmentToQuote(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch(`${this.apiUrl}${environment.endpoints.addAttachmentToQuote}/${id}`, formData);
  }

  deleteQuote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${environment.endpoints.deleteQuote}/${id}`);
  }
} 