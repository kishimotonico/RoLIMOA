import React, { FC } from 'react';
import TaskObject from './TaskObject';
import config from './config.json';
import './App.css';

const App: FC = () => {
  return (
    <div className="container">
      <header>
        <h1>ふぇぇ…ロボコン試合管理するよぉ</h1>
        {config.rule.task_objects.map(config => (
          <TaskObject {...config} />
        ))}
      </header>
    </div>
  );
}

export default App;
