import React, { FC } from 'react';
import TaskObject from './TaskObject';
import './App.css';

const taskObjects = [
  {
    id: "slipper_10",
    description: "10点スリッパ",
    initialValue: 12,
    min: 0,
    max: 24,
  },
  {
    id: "slipper_20",
    description: "20点スリッパ",
  },
  {
    id: "violation",
    description: "違反スリッパ",
  },
];

const App: FC = () => {
  return (
    <div className="container">
      <header>
        <h1>ふぇぇ…ロボコン試合管理するよぉ</h1>
        {taskObjects.map(taskObject => (
          <TaskObject {...taskObject} />
        ))}
      </header>
    </div>
  );
}

export default App;
