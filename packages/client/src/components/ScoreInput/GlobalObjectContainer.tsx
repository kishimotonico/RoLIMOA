import type { CustomControlPanelType, TaskObjectConfigType } from '@rolimoa/common/config';
import type { RootState } from '@rolimoa/common/redux';
import { scoreStateSlice } from '@rolimoa/common/redux';
import { operationLogsStateSlice } from '@rolimoa/common/redux';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  type ScoreUpdateContext,
  onScoreUpdateAfter,
  onScoreUpdateBefore,
} from '~/custom/event.scoreUpdate';
import { LyricalSocket } from '~/lyricalSocket';
import { BaseControl } from './BaseControl';
import { ErrorObject } from './ErrorObject';

type GlobalObjectContainerProps = {
  taskConfig: TaskObjectConfigType;
  controlConfig?: CustomControlPanelType;
};

export const GlobalObjectContainer = ({
  taskConfig,
  controlConfig,
}: GlobalObjectContainerProps) => {
  const { id } = taskConfig;

  const currentValue = useSelector<RootState, number | undefined>(
    (state) => state.score.global[id],
  );
  const dispatch = useDispatch();

  const stateUpdate = useCallback(
    (value: number, command = '') => {
      const taskUpdateAction = scoreStateSlice.actions.setGlobalUpdate({
        taskObjectId: id,
        afterValue: value,
      });
      const addLogAction = operationLogsStateSlice.actions.addLog({
        op: {
          type: 'ScoreUpdate',
          field: 'global',
          obj: id,
          value,
          cmd: command,
        },
      });
      const ctx: ScoreUpdateContext = {
        dispatch,
        event: {
          type: 'scoreUpdate',
          afterValue: value,
          fieldSide: 'global',
          taskObjectId: id,
          command,
          action: taskUpdateAction,
        },
      };

      const isOk = onScoreUpdateBefore(ctx);
      if (!isOk) {
        console.debug('onScoreUpdateBeforeでキャンセルされました', {
          event: ctx,
        });
        return;
      }
      LyricalSocket.dispatch([taskUpdateAction, addLogAction], dispatch);
      onScoreUpdateAfter(ctx);
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
