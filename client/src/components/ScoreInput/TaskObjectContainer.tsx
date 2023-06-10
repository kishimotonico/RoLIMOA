import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'slices';
import { FieldSideType, scoreStateSlice } from 'slices/score';
import { PluseMinuseButtonControl } from './PluseMinuseButtonControl';
import { ErrorObject } from './ErrorObject';
import { LyricalSocket } from 'lyricalSocket';
import { TaskObjectConfigType } from 'config/types';
import { ToggleSwitchControl } from './ToggleSwitchControl';
import { ToggleButtonControl } from './ToggleButtonControl';

type TaskObjectContainerProps = {
  fieldSide: FieldSideType,
  config: TaskObjectConfigType,
};

export const TaskObjectContainer: FC<TaskObjectContainerProps> = ({
  fieldSide,
  config,
}) => {
  const { id, ui } = config;

  const currentValue = useSelector<RootState, number|undefined>((state) => state.score.fields[fieldSide].tasks[id]);
  const dispatch = useDispatch();

  const stateUpdate = useCallback((value: number) => {
    const action = scoreStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: value,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, id]);

  const colorTheme = fieldSide === "blue" ? "primary" : "secondary";

  if (currentValue === undefined) {
    console.error(`ふぇぇ！"${id}"のタスクオブジェクトが取得できないよぉ`);
    return <ErrorObject config={config} />;
  }

  return (
    ui?.type === "toggle_switch" ? 
      <ToggleSwitchControl
        color={colorTheme}
        config={config}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
      />
    : ui?.type === "toggle_button" ?
      <ToggleButtonControl
        config={config}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
      />
    : <PluseMinuseButtonControl
        color={colorTheme}
        config={config}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
      />
  )
};
