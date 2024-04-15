import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://34.175.187.252:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Verificar si el inicio de sesión fue exitoso y si se recibió un token JWT
          if (response && response.token) {
            // Almacenar el token JWT en el almacenamiento local del navegador
            localStorage.setItem('token', response.token);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  logout(): void {
    // Eliminar el token JWT del almacenamiento local del navegador al cerrar sesión
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    // Verificar si el token JWT existe en el almacenamiento local del navegador
    const token = localStorage.getItem('token');
    // Devolver true si el token JWT existe y no está caducado, false de lo contrario
    return !!token;
  }

  getCurrentUser(): any {
    // Obtener el token JWT del almacenamiento local del navegador
    const token = localStorage.getItem('token');
    if (!token) {
      // No hay token JWT, el usuario no está autenticado
      return null;
    }

    // Decodificar el token JWT para obtener la información del usuario
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      fullName: payload.fullName,
      email: payload.email
    };
  }
}
