import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from 'config/load';

export type ScoreState = Record<FieldSideType, TeamScoreStateType>;

export type FieldSideType = "blue" | "red";

export type TeamScoreStateType = {
  tasks: ObjectsStateType,    // 各チームのタスクの進行状況
  enable: boolean,            // スコアの有効フラグ
  winner: boolean,            // 勝利フラグ
  vgoal?: number,             // Vゴールタイム
};
export type ObjectsStateType = { [objectId: string]: number; };

type TaskUpdateActionPayload = {
  fieldSide: FieldSideType,
  taskObjectId: string,
  afterValue: number,
};

export const initialState: ScoreState = {
  blue: {
    tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
    enable: true,
    winner: false,
    vgoal: undefined,
  },
  red: {
    tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
    enable: true,
    winner: false,
    vgoal: undefined,
  },
};

export const scoreStateSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<ScoreState>) => action.payload,
    setTaskUpdate: (state, action: PayloadAction<TaskUpdateActionPayload>) => {
      state[action.payload.fieldSide].tasks[action.payload.taskObjectId] = action.payload.afterValue;
    },
    setScoreEnable: (state, action: PayloadAction<{fieldSide: FieldSideType, enable: boolean}>) => {
      state[action.payload.fieldSide].enable = action.payload.enable;
    },
    setWinnerFlag: (state, action: PayloadAction<{fieldSide: FieldSideType, winner: boolean}>) => {
      state[action.payload.fieldSide].winner = action.payload.winner;
    },
    setVgoalTime: (state, action: PayloadAction<{fieldSide: FieldSideType, vgoalTime: number}>) => {
      state[action.payload.fieldSide].vgoal = action.payload.vgoalTime;
    },
    unsetVgoalTime: (state, action: PayloadAction<{fieldSide: FieldSideType}>) => {
      state[action.payload.fieldSide].vgoal = undefined;
    },
  },
});
