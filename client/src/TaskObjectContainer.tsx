import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LyricalSocket } from './lyricalSocket';
import { RootState, TaskObjectsType, taskStateSlice } from './store';
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
  const taskObjects = useSelector<RootState, TaskObjectsType>((state) => state.task[fieldSide]);
  const dispatch = useDispatch();

  const currentValue = taskObjects[id];
  if (currentValue === undefined) {
    console.error("ふぇぇ！", taskObjects, id);
  }

  const decrement = useCallback(() => {
    const nextValue = currentValue - 1;
    const action = taskStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: nextValue,
    });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide, id, currentValue]);

  const increment = useCallback(() => {
    const nextValue = currentValue + 1;
    const action = taskStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: nextValue,
    });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    // socket.emit("update", {
    //   fieldSide,
    //   taskObjectId: id,
    //   afterValue: nextValue,
    // });
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide, id, currentValue]);

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
