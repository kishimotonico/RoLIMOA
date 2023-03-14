import { combineReducers } from '@reduxjs/toolkit';
import { scoreStateSlice } from './score';
import { phaseStateSlice } from './phase';
import { matchStateSlice } from './match';
import { connectedDevicesStateSlice } from './connectedDevices';

export const rootReducer = combineReducers({
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
  match: matchStateSlice.reducer,
  connectedDevices: connectedDevicesStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
