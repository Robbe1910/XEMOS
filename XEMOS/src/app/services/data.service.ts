import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../redux/reducers/reducers';
import { loadSensorData } from '../redux/actions/sensor.actions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://34.175.187.252:3000/sensor-data'; // URL de tu servidor

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  // Método para hacer una solicitud GET al servidor y obtener los datos
  getData(): Observable<any> {
    // Dispara una acción para cargar los datos del sensor
    this.store.dispatch(loadSensorData());
    // No es necesario hacer una solicitud HTTP directamente aquí
    // La carga de datos se manejará a través de Redux y Effects
    return EMPTY; // No devuelve nada aquí, ya que los datos se manejan a través de Redux
  }
}
