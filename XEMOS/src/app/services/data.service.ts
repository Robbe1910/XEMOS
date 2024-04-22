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
}


