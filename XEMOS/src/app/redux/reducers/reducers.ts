import { ActionReducerMap } from '@ngrx/store';
import { SensorState, sensorReducer } from './sensor.reducer';

// Define la interfaz del estado de tu aplicación
export interface AppState {
  sensor: SensorState;
  // Puedes agregar más estados aquí si es necesario
}

// Define el conjunto de reducers que componen el estado de tu aplicación
export const reducers: ActionReducerMap<AppState> = {
  sensor: sensorReducer,
  // Puedes agregar más reducers aquí si tienes más estados en tu aplicación
};
