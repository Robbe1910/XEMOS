import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../services/data.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { loadSensorData, loadSensorDataSuccess, loadSensorDataFailure } from '../actions/sensor.actions';

@Injectable()
export class SensorEffects {

  loadData$ = createEffect(() => this.actions$.pipe(
    ofType(loadSensorData),
    mergeMap(() => this.dataService.getData()
      .pipe(
        map(data => loadSensorDataSuccess({ data })),
        catchError(error => {
          // Aquí puedes manejar el error como desees, por ejemplo, disparar una acción de error
          return EMPTY;
        })
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}
}