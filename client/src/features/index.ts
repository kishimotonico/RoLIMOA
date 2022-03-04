import { combineReducers } from '@reduxjs/toolkit';
import { scoreStateSlice } from './score';
import { phaseStateSlice } from './phase';
import { teamsStateSlice } from './teams';
import { connectedDevicesStateSlice } from './connectedDevices';

export const rootReducer = combineReducers({
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
  teams: teamsStateSlice.reducer,
  connectedDevices: connectedDevicesStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
