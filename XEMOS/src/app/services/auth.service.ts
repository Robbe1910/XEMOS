import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://34.175.187.252:3000';
  private loginTokenKey = 'loginToken';
  private tokenKey = "token"

  constructor(private http: HttpClient) { }

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

  registerUser(user: any): void {
    // Lógica para registrar un nuevo usuario en el servidor
    this.register(user).subscribe(
      (response: any) => {
        console.log('User registered successfully');
        const loginToken = response.loginToken; // Obtener el loginToken de la respuesta del servidor
        this.storeLoginToken(loginToken);
      },
      (error: any) => {
        console.error('Error registering user:', error);
      }
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

  getCurrentUserRegistered(): any {
    // Obtener el token JWT del almacenamiento local del navegador
    const token = this.getLoginToken() // Usar la misma clave aquí
    console.log(token )
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

    // Verificar si la propiedad emailConfirmed está presente en el payload
    const emailConfirmed = payload.emailConfirmed || false;

    // Devolver el objeto de usuario con emailConfirmed si está presente en el payload
    return {
      fullName: payload.fullName,
      email: payload.email,
      emailConfirmed: emailConfirmed,
      loginToken: token,
      token: payload.token
    };
  }

  getCurrentUser(): any {
    // Obtener el token JWT del almacenamiento local del navegador
    const token = this.getToken() // Usar la misma clave aquí
    console.log(token )
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

    // Verificar si la propiedad emailConfirmed está presente en el payload
    const emailConfirmed = payload.emailConfirmed || false;

    // Devolver el objeto de usuario con emailConfirmed si está presente en el payload
    return {
      fullName: payload.fullName,
      email: payload.email,
      emailConfirmed: emailConfirmed,
      loginToken: token,
      token: payload.token
    };
  }

  
  checkEmailConfirmed(): Observable<any> {
    // Obtener el token JWT del almacenamiento local del navegador
    const token = this.getLoginToken();
  
    // Verificar si el token existe
    if (!token) {
      // Si no hay token, devolver un error
      return throwError('No token available');
    }
  
    // Hacer una solicitud HTTP para verificar si el correo electrónico está confirmado
    return this.http.get<any>(`${this.baseUrl}/checkEmailConfirmed`, {
      headers: {
        Authorization: `Bearer ${token}` // Adjuntar el token JWT en el encabezado Authorization
      }
    });
  }
  

  resendConfirmationEmail(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resendConfirmationEmail`, { token });
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  

  // Obtiene el token de la respuesta del servidor y lo almacena
  getAuthTokenFromResponse(email: string, password: string): void {
    // Hacer una solicitud HTTP para obtener el token
    this.http.post<any>(`${this.baseUrl}/login`, { email, password }).subscribe(
      response => {
        if (response && response.token) {
          // Almacena el token único en el almacenamiento local
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
  getLoginToken(): string | null {
    return localStorage.getItem(this.loginTokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }  

  // Almacena el token de inicio de sesión en el almacenamiento local del navegador
  storeLoginToken(token: string): void {
    localStorage.setItem('loginToken', token);
  }

}
