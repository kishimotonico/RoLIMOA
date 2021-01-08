import { TaskObjectsType } from "./reducer";

export const TaskUpdateActionType = {
  TASK_UPDATE: 'task/update',
  TASK_SET_STATE: 'task/set_state',
} as const;

type TaskUpdateAction = {
  type: 'task/update';
  payload: {
    taskObjectId: string;
    operation: string;
    afterValue: number;
  };
};

type TaskSetStateAction = {
  type: 'task/set_state';
  payload: TaskObjectsType;
};

export type ActionType = TaskUpdateAction | TaskSetStateAction;

export const setTaskObjectValue = (taskObjectId: string, afterValue: number): ActionType => ({
  type: TaskUpdateActionType.TASK_UPDATE,
  payload: {
    taskObjectId,
    operation: "setValue",
    afterValue,
  },
});

export const setTaskStateAll = (newState: TaskObjectsType): ActionType => ({
  type: TaskUpdateActionType.TASK_SET_STATE,
  payload: newState,
});
