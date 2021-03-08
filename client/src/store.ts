import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from './config.json';

export type FieldSideType = "blue" | "red";
export type TaskObjectsType = { [objectId: string]: number; };
export type WholeTaskState = Record<FieldSideType, TaskObjectsType>;
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

export const taskStateSlice = createSlice({
  name: 'task',
  initialState: {
    blue: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
    red: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
  } as WholeTaskState,
  reducers: {
    setTaskUpdate: (state, action: PayloadAction<TaskUpdateActionPayload>) => {
      state[action.payload.fieldSide][action.payload.taskObjectId] = action.payload.afterValue;
    },
    setCurrent: (_, action: PayloadAction<WholeTaskState>) => action.payload,
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
  task: taskStateSlice.reducer,
  phase: phaseStateSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
