import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers/reducers';
import { SensorState } from '../reducers/sensor.reducer';

export const selectSensorFeature = (state: AppState) => state.sensor;

export const selectSensorData = createSelector(
  selectSensorFeature,
  (state: SensorState) => state.data
);