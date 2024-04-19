import { createReducer, on } from '@ngrx/store';
import { loadSensorDataSuccess } from '../actions/sensor.actions';

export interface SensorState {
  data: any;
}

export const initialState: SensorState = {
  data: null
};

export const sensorReducer = createReducer(
  initialState,
  on(loadSensorDataSuccess, (state, { data }) => ({
    ...state,
    data
  }))
);