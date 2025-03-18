import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType, scoreStateSlice } from '@/slices/score';
import { ErrorObject } from './ErrorObject';
import { LyricalSocket } from '@/lyricalSocket';
import { CustomControlPanelType, TaskObjectConfigType } from '@/config/types';
import { BaseControl } from './BaseControl';
import { operationLogsStateSlice } from '@/slices/operationLogs';

type TaskObjectContainerProps = {
  fieldSide: FieldSideType,
  taskConfig: TaskObjectConfigType,
  controlConfig?: CustomControlPanelType,
};

export const TaskObjectContainer: FC<TaskObjectContainerProps> = ({
  fieldSide,
  taskConfig,
  controlConfig,
}) => {
  const { id } = taskConfig;

  const currentValue = useSelector<RootState, number|undefined>((state) => state.score.fields[fieldSide].tasks[id]);
  const dispatch = useDispatch();

  const stateUpdate = useCallback((value: number, command: string = "") => {
    const actions = [
      scoreStateSlice.actions.setTaskUpdate({
        fieldSide,
        taskObjectId: id,
        afterValue: value,
      }),
      operationLogsStateSlice.actions.addLog({
        op: {
          type: "ScoreUpdate",
          field: fieldSide,
          obj: id,
          value,
          cmd: command,
        },
      }),
    ];
    LyricalSocket.dispatch(actions, dispatch);
  }, [dispatch, fieldSide, id]);

  const color = fieldSide === "blue" ? "primary" : "secondary";

  if (currentValue === undefined) {
    console.error(`ふぇぇ！"${id}"のタスクオブジェクトが取得できないよぉ`);
    return <ErrorObject description={taskConfig.description} />;
  }

  return (
    <BaseControl
      taskConfig={taskConfig}
      controlConfig={controlConfig}
      currentValue={currentValue}
      stateUpdate={stateUpdate}
      color={color}
    />
  );
};
