import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://34.175.187.252:3000';

  constructor(private http: HttpClient) { }

  confirmEmail(token: string) {
    return this.http.get(`${this.baseUrl}/confirm/${token}`);
  }
}
