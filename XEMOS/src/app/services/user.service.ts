import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://34.175.187.252:3000';
  //private urlLocalhost= 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  updateEmail(email: string, newEmail: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/email`, { email, newEmail });
  }

  updatePassword(email: string, password: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/password`, { email, password, newPassword });
  }

  setEmergencyNumber(email: string, emergencyNumber: string): Observable<any> {
    // Verificar si el usuario ya tiene un número de emergencia establecido
    return this.getEmergencyNumber(email).pipe(
      switchMap((response: any) => {
        // Si el usuario ya tiene un número de emergencia establecido, actualizarlo
        if (response && response.emergencyNumber) {
          return this.http.put<any>(`${this.baseUrl}/users/emergencyNumber`, { email, emergencyNumber });
        } else {
          // Si el usuario no tiene un número de emergencia establecido, establecerlo por primera vez
          return this.http.post<any>(`${this.baseUrl}/users/emergencyNumber`, { email, emergencyNumber });
        }
      })
    );
  }

  checkEmergencyNumberExists(emergencyNumber: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/checkEmergencyNumber/${emergencyNumber}`);
  }
  

  getEmergencyNumber(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/emergencyNumber/${email}`);
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/checkEmail/${email}`);
  }

  deleteUser(email: string): Observable<any> {
    const url = `${this.baseUrl}/users/${email}`; // URL para eliminar usuario
    return this.http.delete<any>(url);
  }
}
