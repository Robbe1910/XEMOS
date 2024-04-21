import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , throwError  } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://34.175.187.252:3000';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }
  
  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}/users`, user);
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
    // Dividir el token en sus partes (header, payload, signature)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Token JWT no válido: No se encontraron las tres partes.');
      return null;
    }
    
    // Decodificar el payload del token (la segunda parte)
    const payload = JSON.parse(atob(tokenParts[1]));
    return {
      fullName: payload.fullName,
      email: payload.email
    };
  }

  resendConfirmationEmail(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resendConfirmationEmail`, { loginToken: token });
}

  // Almacena el token en el almacenamiento local del navegador
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

 // Obtiene el token de la respuesta del servidor y lo almacena
 getAuthTokenFromResponse(email: string, password: string): void {
  // Hacer una solicitud HTTP para obtener el token
  this.http.post<any>(`${this.baseUrl}/login`, { email, password }).subscribe(
    response => {
      if (response && response.token) {
        // Almacena el token en el almacenamiento local
        this.storeToken(response.token);
      } else {
        console.error('No se recibió ningún token en la respuesta del servidor');
      }
    },
    error => {
      console.error('Error al intentar obtener el token del servidor:', error);
    }
  );
}

  // Obtiene el token almacenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Almacena el token de inicio de sesión en el almacenamiento local del navegador
  storeLoginToken(token: string): void {
    localStorage.setItem('loginToken', token);
  }
  
}
