import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap  } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DataService {
  private apiUrl = 'http://34.175.187.252:3000/sensor-data';

  constructor(private http: HttpClient) {}

  // Función para hacer fetch cada segundo a los datos del sensor
  getData(): Observable<any> {
    // Usar un temporizador para emitir un valor cada segundo
    return timer(0, 1000).pipe(
      switchMap(() => this.http.get<any>(this.apiUrl)) 
    );
  }
}


