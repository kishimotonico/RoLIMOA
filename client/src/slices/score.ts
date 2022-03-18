import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from 'config.json';

export type WholeScoreState = Record<FieldSideType, ScoreStateType>;

export type FieldSideType = "blue" | "red";

export type ScoreStateType = {
  tasks: TaskStateType,       // タスクの進行状況
  enable: boolean,            // スコアの有効フラグ
  winner: boolean,            // 勝利フラグ
  refValues: RefValuesType,   // 途中式などの値
  vgoal?: number,             // Vゴールタイム
};
export type TaskStateType = { [objectId: string]: number; };
export type RefValuesType = { [referenceId: string]: number; };

type TaskUpdateActionPayload = {
  fieldSide: FieldSideType,
  taskObjectId: string,
  afterValue: number,
};

export const initialState: WholeScoreState = {
  blue: {
    tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
    enable: true,
    winner: false,
    refValues: {},
    vgoal: undefined,
  },
  red: {
    tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
    enable: true,
    winner: false,
    refValues: {},
    vgoal: undefined,
  },
};

export const scoreStateSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<WholeScoreState>) => action.payload,
    setTaskUpdate: (state, action: PayloadAction<TaskUpdateActionPayload>) => {
      state[action.payload.fieldSide].tasks[action.payload.taskObjectId] = action.payload.afterValue;
    },
    setScoreEnable: (state, action: PayloadAction<{fieldSide: FieldSideType, enable: boolean}>) => {
      state[action.payload.fieldSide].enable = action.payload.enable;
    },
    setWinnerFlag: (state, action: PayloadAction<{fieldSide: FieldSideType, enable: boolean}>) => {
      state[action.payload.fieldSide].winner = action.payload.enable;
    },
    setVgoalTime: (state, action: PayloadAction<{fieldSide: FieldSideType, vgoalTime: number}>) => {
      state[action.payload.fieldSide].vgoal = action.payload.vgoalTime;
    },
    unsetVgoalTime: (state, action: PayloadAction<{fieldSide: FieldSideType}>) => {
      state[action.payload.fieldSide].vgoal = undefined;
    },
    setRefValues: (state, action: PayloadAction<{fieldSide: FieldSideType, refValues: RefValuesType}>) => {
      state[action.payload.fieldSide].refValues = action.payload.refValues;
    },
  },
});
