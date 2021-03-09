import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from './config.json';

export type FieldSideType = "blue" | "red";

export type TaskStateType = { [objectId: string]: number; };
export type ScoreStateType = {
  tasks: TaskStateType,   // タスクの進行状況
  enable: boolean,        // スコアの有効フラグ
};
export type WholeScoreState = Record<FieldSideType, ScoreStateType>;

type TaskUpdateActionPayload = {
  fieldSide: FieldSideType,
  taskObjectId: string,
  afterValue: number,
  // operation: string,     // バリデーションのために "increment"|"decrement" を指定する予定だったが現在使っていない
};

export type PhaseState = {
  id: string,
  startTime: number
};

export const scoreStateSlice = createSlice({
  name: 'task',
  initialState: {
    blue: {
      tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
      enable: false,
    },
    red: {
      tasks: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
      enable: false,
    },
  } as WholeScoreState,
  reducers: {
    setTaskUpdate: (state, action: PayloadAction<TaskUpdateActionPayload>) => {
      state[action.payload.fieldSide].tasks[action.payload.taskObjectId] = action.payload.afterValue;
    },
    setScoreEnable: (state, action: PayloadAction<{fieldSide: FieldSideType, enable: boolean}>) => {
      state[action.payload.fieldSide].enable = action.payload.enable;
    },
    setCurrent: (_, action: PayloadAction<WholeScoreState>) => action.payload,
  },
});

export const phaseStateSlice = createSlice({
  name: 'phase',
  initialState: {
    id: "default",
    startTime: Date.now(),
  } as PhaseState,
  reducers: {
    setCurrent: (_, action: PayloadAction<PhaseState>) => action.payload,
  },
});

export const connectionStateSlice = createSlice({
  name: 'connection',
  initialState: false as boolean,
  reducers: {
    setCurrent: (_, action: PayloadAction<boolean>) => action.payload,
  },
});

export const rootReducer = combineReducers({
  connection: connectionStateSlice.reducer,
  score: scoreStateSlice.reducer,
  phase: phaseStateSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
