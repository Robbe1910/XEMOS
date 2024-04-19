import { createAction, props } from '@ngrx/store';

export const loadSensorData = createAction('[Sensor] Load Data');
export const loadSensorDataSuccess = createAction('[Sensor] Load Data Success', props<{ data: any }>());
export const loadSensorDataFailure = createAction('[Sensor] Load Data Failure', props<{ error: any }>());