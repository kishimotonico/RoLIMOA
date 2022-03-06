import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OperationType = TaskUpdateOperation | PhaseChangeOperation;

export type TaskUpdateOperation = {
  type: "taskUpdate",
  target: string,
};

export type PhaseChangeOperation = {
  type: "phaseChange",
};

export type OperationLog = {
  time: number,               // Unix時刻
  phase: {
    phaseId: number,          // フェーズID
    elapsedSecound: number,   // 経過秒数
  },
  user: {
    socketId: string,         // socket ID
    name: string,             // ユーザ名
  },
  operation: OperationType,   // 操作内容
};

export const initialState: OperationLog[] = [];

export const operationLogStateSlice = createSlice({
  name: 'operationLog',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<OperationLog[]>) => action.payload,
    addLog: (state, action: PayloadAction<OperationLog>) => [...state, action.payload],
  },
});
