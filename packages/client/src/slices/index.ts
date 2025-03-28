import { combineReducers } from '@reduxjs/toolkit';
import { scoreStateSlice } from './score';
import { phaseStateSlice } from './phase';
import { matchStateSlice } from './match';
import { resultRecordsStateSlice } from './resultRecord';
import { connectedDevicesStateSlice } from './connectedDevices';
import { streamingInterfaceSlice } from './streamingInterface';
import { operationLogsStateSlice } from './operationLogs';

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
