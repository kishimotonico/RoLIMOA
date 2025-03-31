import { type FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@rolimoa/common/redux';
import { scoreStateSlice } from '@rolimoa/common/redux';
import { ErrorObject } from './ErrorObject';
import { LyricalSocket } from '@/lyricalSocket';
import type {
  CustomControlPanelType,
  TaskObjectConfigType,
} from '@rolimoa/common/config';
import { BaseControl } from './BaseControl';
import { operationLogsStateSlice } from '@rolimoa/common/redux';

type GlobalObjectContainerProps = {
  taskConfig: TaskObjectConfigType;
  controlConfig?: CustomControlPanelType;
};

export const GlobalObjectContainer: FC<GlobalObjectContainerProps> = ({
  taskConfig,
  controlConfig,
}) => {
  const { id } = taskConfig;

  const currentValue = useSelector<RootState, number | undefined>(
    (state) => state.score.global[id],
  );
  const dispatch = useDispatch();

  const stateUpdate = useCallback(
    (value: number, command = '') => {
      const actions = [
        scoreStateSlice.actions.setGloablUpdate({
          taskObjectId: id,
          afterValue: value,
        }),
        operationLogsStateSlice.actions.addLog({
          op: {
            type: 'ScoreUpdate',
            field: 'global',
            obj: id,
            value,
            cmd: command,
          },
        }),
      ];
      LyricalSocket.dispatch(actions, dispatch);
    },
    [dispatch, id],
  );

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
    />
  );
};
