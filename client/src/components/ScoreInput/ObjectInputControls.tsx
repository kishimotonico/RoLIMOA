import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PluseMinuseButtonControl } from './PluseMinuseButtonControl';
import { LyricalSocket } from 'lyricalSocket';
import { TaskObjectConfigType } from 'config/types';
import { scoreStateSlice } from 'slices/score';
import { RootState } from 'slices';
import { ErrorObject } from './ErrorObject';

type ObjectInputControlProps = {
  fieldSide: "blue" | "red",
  config: TaskObjectConfigType,
};

export const ObjectInputControl: FC<ObjectInputControlProps> = ({
  fieldSide,
  config,
}) => {
  const { id } = config;

  const currentValue = useSelector<RootState, number|undefined>((state) => state.score.fields[fieldSide].tasks[id]);
  const dispatch = useDispatch();

  const onChange = useCallback((value: number) => {
    const action = scoreStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: value,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, id]);

  if (currentValue === undefined) {
    console.error(`ふぇぇ！"${id}"のタスクオブジェクトが取得できないよぉ`);
    return <ErrorObject config={config} />;
  }

  return (
    <PluseMinuseButtonControl
      fieldSide={fieldSide}
      config={config}
      currentValue={currentValue}
      onChange={onChange}
    />
  )
};
