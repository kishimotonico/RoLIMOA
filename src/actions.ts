export const TaskUpdateActionType = {
  TASK_UPDATE: 'TASK_UPDATE',
}

type ValueOf<T> = T[keyof T];

export type TaskUpdateAction = {
  type: ValueOf<typeof TaskUpdateActionType>;
  taskObjectId: string;
  operation: string;
  afterValue: number;
};

export const increment = (taskObjectId: string, afterValue: number): TaskUpdateAction => ({
  type: TaskUpdateActionType.TASK_UPDATE,
  taskObjectId,
  operation: "increment",
  afterValue,
});

export const decrement = (taskObjectId: string, afterValue: number): TaskUpdateAction => ({
  type: TaskUpdateActionType.TASK_UPDATE,
  taskObjectId,
  operation: "decrement",
  afterValue,
});

export const setValue = (taskObjectId: string, afterValue: number): TaskUpdateAction => ({
  type: TaskUpdateActionType.TASK_UPDATE,
  taskObjectId,
  operation: "setValue",
  afterValue,
});
