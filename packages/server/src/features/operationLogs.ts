import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type OperationLog = {
  id: string;
  op: OperationType;
  at?: number;
  by?: string;
};

export type OperationType = ScoreUpdateType | PhaseChangeType;

export type ScoreUpdateType = {
  type: 'ScoreUpdate';
  field: 'blue' | 'red' | 'global';
  obj: string;
  value: number;
  cmd?: string; // e.g. "+1", "=0"
};

export type PhaseChangeType = {
  type: 'PhaseChange';
  phase: string;
  isAuto?: boolean;
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const operationLogsStateSlice = createSlice({
  name: 'operationLogs',
  initialState: [] as OperationLog[],
  reducers: {
    setState: (_, action: PayloadAction<OperationLog[]>) => action.payload,
    addLog: (cur, action: PayloadAction<PartialBy<OperationLog, 'id'>>) => {
      const id = action.payload.id ?? Math.random().toString(36).slice(-8);

      cur.push({ id, ...action.payload });
    },
  },
});
