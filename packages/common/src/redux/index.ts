import { combineReducers } from '@reduxjs/toolkit';

import {
  connectedDevicesStateSlice,
  matchStateSlice,
  operationLogsStateSlice,
  phaseStateSlice,
  resultRecordsStateSlice,
  scoreStateSlice,
  streamingInterfaceSlice,
} from './slices/index.js';

export const rootReducer = combineReducers({
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
  match: matchStateSlice.reducer,
  operationLogs: operationLogsStateSlice.reducer,
  resultRecords: resultRecordsStateSlice.reducer,
  connectedDevices: connectedDevicesStateSlice.reducer,
  streamingInterface: streamingInterfaceSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export * from './slices/index.js';
