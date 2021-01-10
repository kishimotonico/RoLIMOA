import { FieldSideType, PhaseState, PhaseTick, WholeTaskState } from "./reducer";

export const TaskUpdateActionType = {
  CONNECT_SET: 'connect/set',
  TASK_UPDATE: 'task/update',
  TASK_SET_STATE: 'task/set_state',
  PHASE_SET_STATE: 'phase/set_state',
  PHASE_TICK: 'phase/tick',
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
    fieldSide: FieldSideType;
    taskObjectId: string;
    afterValue: number;
    operation: string;
  };
};

type TaskSetStateAction = {
  type: 'task/set_state';
  payload: WholeTaskState;
};

type PhaseSetStateAction = {
  type: 'phase/set_state';
  payload: PhaseState;
};

type PhaseSetTickAction = {
  type: 'phase/tick';
  payload: PhaseTick;
}

export type ActionType = ConnectSetAction | TaskUpdateAction | TaskSetStateAction | PhaseSetStateAction | PhaseSetTickAction;

export const setIsConnect = (isConnect: boolean): ActionType => ({
  type: TaskUpdateActionType.CONNECT_SET,
  payload: {
    currentState: isConnect,
  },
});

export const setTaskObjectValue = (fieldSide: FieldSideType, taskObjectId: string, afterValue: number): ActionType => ({
  type: TaskUpdateActionType.TASK_UPDATE,
  payload: {
    fieldSide,
    taskObjectId,
    afterValue,
    operation: "setValue",
  },
});

export const setTaskStateAll = (newState: WholeTaskState): ActionType => ({
  type: TaskUpdateActionType.TASK_SET_STATE,
  payload: newState,
});

export const setPhaseTick = (payload: PhaseTick): ActionType => ({
  type: TaskUpdateActionType.PHASE_TICK,
  payload,
});

export const setPhaseState = (payload: PhaseState): ActionType => ({
  type: TaskUpdateActionType.PHASE_SET_STATE,
  payload,
});
