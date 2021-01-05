import { Reducer } from 'redux';
import { TaskUpdateAction } from './actions';
import config from './config.json';

export type TaskObjectsType = { [objectId: string]: number; };

export type TaskObjectsState = {
  taskObjects: TaskObjectsType;
};
export const initialState: TaskObjectsState = {
  taskObjects: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
};

export const taskObjectsReducer: Reducer<TaskObjectsState, TaskUpdateAction> = (
  state: TaskObjectsState = initialState,
  action: TaskUpdateAction,
): TaskObjectsState => {
  if (action.operation === "setValue") {
    return {
      ...state,
      taskObjects: {
        ...state.taskObjects,
        [action.taskObjectId]: action.afterValue,
      },
    };
  }
  const currentValue = state.taskObjects[action.taskObjectId];
  const diff = action.operation === "increment" ? +1 : -1;
  return {
    ...state,
    taskObjects: {
      ...state.taskObjects,
      [action.taskObjectId]: currentValue + diff,
    },
  };
};
