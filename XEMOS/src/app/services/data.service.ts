import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://34.175.187.252:3000/sensor-data'; // URL de tu servidor

  constructor(private http: HttpClient) {}

  // Método para hacer una solicitud POST al servidor
  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Método para hacer una solicitud GET al servidor y obtener los datos
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
