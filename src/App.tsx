import React, { FC, useEffect } from 'react';
import TaskObject from './TaskObject';
import { LyricalSocket } from './lyricalSocket';
import config from './config.json';
import './App.css';

const App: FC = () => {
  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;
    socket.socket.emit("message", "hey");
    socket.socket.emit("message", "hey");

    return () => {
      // console.log('useEffect-return');
    };
  });

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
