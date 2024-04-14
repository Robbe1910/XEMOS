import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  updateEmail(email: string, newEmail: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/email`, { email, newEmail });
  }

  updatePassword(email: string, password: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/password`, { email, password, newPassword });
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`http://localhost:3000/checkEmail/${email}`);
  }

  deleteUser(email: string): Observable<any> {
    const url = `${this.baseUrl}/users/${email}`; // URL para eliminar usuario
    return this.http.delete<any>(url);
  }
}
