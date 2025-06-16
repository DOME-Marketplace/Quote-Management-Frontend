import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.productApiUrl;

  constructor(private http: HttpClient) {}

  getProductSpecifications(offset: number = 0, limit: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.endpoints.products.getSpecifications}`, {
      params: {
        offset: offset.toString(),
        limit: limit.toString()
      }
    });
  }
} 