import { combineReducers } from '@reduxjs/toolkit';
import { connectionStateSlice } from './connection';
import { scoreStateSlice } from './score';
import { phaseStateSlice } from './phase';
import { teamsStateSlice } from './teams';

export const rootReducer = combineReducers({
  connection: connectionStateSlice.reducer,
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
  teams: teamsStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
