import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, timer, switchMap, Subscription  } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../redux/reducers/reducers';
import { loadSensorData } from '../redux/actions/sensor.actions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://34.175.187.252:3000/sensor-data'; // Replace with your JSON server URL

  constructor(private http: HttpClient) {}

  // Function to fetch sensor data every second
  getData(): Observable<any> {
    // Use timer to emit a value every second
    return timer(0, 1000).pipe(
      switchMap(() => this.http.get<any>(this.apiUrl)) // Make GET request to JSON server
    );
  }

  // Método para obtener datos del sensor y suscribirse a ellos
  getSensorData(): Subscription {
    return this.getData().subscribe(
      (data) => {
        // Aquí puedes manejar los datos recibidos, como almacenarlos en una variable o enviarlos a otro lugar
        console.log('New sensor data received:', data);
        // Por ejemplo, si necesitas almacenar los datos en el almacenamiento de tu aplicación (ngrx en este caso), puedes hacerlo así:
        // this.store.dispatch(loadSensorData({ data }));
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
      }
    );
  }
}


