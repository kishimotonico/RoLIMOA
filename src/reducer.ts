import { Reducer } from 'redux';
import { TaskUpdateActionType, ActionType } from './actions';
import config from './config.json';

export type TaskObjectsType = { [objectId: string]: number; };

export type TaskObjectsState = {
  taskObjects: TaskObjectsType;
};
export const initialState: TaskObjectsState = {
  taskObjects: Object.fromEntries(config.rule.task_objects.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0])),
};

export const taskObjectsReducer: Reducer<TaskObjectsState, ActionType> = (
  state: TaskObjectsState = initialState,
  action: ActionType,
): TaskObjectsState => {
  switch (action.type) {
    case (TaskUpdateActionType.TASK_UPDATE):
      return {
        ...state,
        taskObjects: {
          ...state.taskObjects,
          [action.payload.taskObjectId]: action.payload.afterValue,
        },
      };

    case (TaskUpdateActionType.TASK_SET_STATE):
      return {
        ...state,
        taskObjects: {
          ...action.payload,
        }
      };

    default:
      return state;
  }
};
