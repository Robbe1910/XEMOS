import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationResponse } from '../model'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://34.175.187.252:3000';

  constructor(private http: HttpClient) { }

  confirmEmail(token: string): Observable<ConfirmationResponse> {
    return this.http.post<ConfirmationResponse>(`${this.baseUrl}/confirmEmail`, { token });
  }
}
