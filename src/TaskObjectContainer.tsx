import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LyricalSocket } from './lyricalSocket';
import { TaskObjectsState, TaskObjectsType } from './reducer';
import * as actions from "./actions";
import { TaskObjectComponent } from "./TaskObjectComponent";

interface TaskObjectProps {
  id: string;
  description: string;
  fieldSide: "blue" | "red";
  min?: number;
  max?: number;
}

export const TaskObject: FC<TaskObjectProps> = ({
  id,
  description,
  fieldSide,
  min = 0,
  max = 524,
}) => {
  const taskObjects = useSelector<TaskObjectsState, TaskObjectsType>((state) => state.taskObjects);
  const dispatch = useDispatch();

  const currentValue = taskObjects[id];
  if (currentValue === undefined) {
    console.error("ふぇぇ！", taskObjects, id);
  }

  const decrement = useCallback(() => {
    dispatch(actions.setValue(id, currentValue - 1));
  }, [dispatch, currentValue, id]);

  const increment = useCallback(() => {
    dispatch(actions.setValue(id, currentValue + 1));
  }, [dispatch, currentValue, id]);

  useEffect(() => {
    const socket = LyricalSocket.instance;
    socket.socket.emit("update", {
      taskObjectId: id,
      afterValue: currentValue,
    });

    return () => {
      console.log('useEffect-return');
    };
  }, [id, currentValue]);

  return (
    <TaskObjectComponent
      description={description}
      currentValue={currentValue}
      min={min}
      max={max}
      fieldSide={fieldSide}
      decrement={decrement}
      increment={increment}
    />
  );
};
