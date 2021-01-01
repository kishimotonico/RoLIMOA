import React, { FC, useState } from 'react';
import { Button, Card, Statistic } from 'semantic-ui-react';

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
  const [count, setCount] = useState(initialValue);
  const decrement = () => setCount((c) => c - 1);
  const increment = () => setCount((c) => c + 1);
  console.log(description);

  return (
    <Card>
      <Statistic className="number-board">
        <Statistic.Label>{description}</Statistic.Label>
        <Statistic.Value>{count}</Statistic.Value>
      </Statistic>
      <Card.Content>
        <div className="ui two buttons">
          <Button onClick={decrement} disabled={count === min}>
            -1
          </Button>
          <Button color="blue" onClick={increment} disabled={count === max}>
            +1
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};


export default TaskObject;
