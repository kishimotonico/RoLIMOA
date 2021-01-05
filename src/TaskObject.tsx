import React, { FC, useEffect } from 'react';
import { Button, Card, Statistic } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { LyricalSocket } from './lyricalSocket';
import { TaskObjectsState, TaskObjectsType } from './reducer';
import * as actions from "./actions";

interface TaskObjectProps {
  id: string;
  description: string;
  initialValue?: number;
  min?: number;
  max?: number;
}

const TaskObject: FC<TaskObjectProps> = ({
  id = "",
  description = "",
  initialValue = 0,
  min = 0,
  max = 524,
}) => {
  const taskObjects = useSelector<TaskObjectsState, TaskObjectsType>((state) => state.taskObjects);
  const dispatch = useDispatch();

  const currentValue = taskObjects[id];
  if (currentValue === undefined) {
    console.error("ふぇぇ！", taskObjects, id);
  }
  const decrement = () => {
    dispatch(actions.setValue(id, currentValue - 1));
  };
  const increment = () => {
    dispatch(actions.setValue(id, currentValue + 1));
  };

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
    <Card>
      <Statistic className="number-board">
        <Statistic.Label>{description}</Statistic.Label>
        <Statistic.Value>{currentValue}</Statistic.Value>
      </Statistic>
      <Card.Content>
        <div className="ui two buttons">
          <Button onClick={decrement} disabled={currentValue === min}>
            -1
          </Button>
          <Button color="blue" onClick={increment} disabled={currentValue === max}>
            +1
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};


export default TaskObject;
