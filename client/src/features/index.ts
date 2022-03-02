import { combineReducers } from '@reduxjs/toolkit';
import { scoreStateSlice } from './score';
import { phaseStateSlice } from './phase';
import { teamsStateSlice } from './teams';

export const rootReducer = combineReducers({
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
  teams: teamsStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
