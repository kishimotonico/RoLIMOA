import { TaskObjectsType } from "./reducer";

export const TaskUpdateActionType = {
  CONNECT_SET: 'connect/set',
  TASK_UPDATE: 'task/update',
  TASK_SET_STATE: 'task/set_state',
} as const;

type ConnectSetAction = {
  type: 'connect/set';
  payload: {
    currentState: boolean;
  };
};

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

export type ActionType = ConnectSetAction | TaskUpdateAction | TaskSetStateAction;

export const setIsConnect = (isConnect: boolean): ActionType => ({
  type: TaskUpdateActionType.CONNECT_SET,
  payload: {
    currentState: isConnect,
  },
});

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
