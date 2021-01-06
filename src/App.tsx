import React, { FC, useEffect } from 'react';
import TaskObject from './TaskObject';
import { LyricalSocket } from './lyricalSocket';
import config from './config.json';
import './App.css';
import { useDispatch } from 'react-redux';
import { setValue } from "./actions";

const App: FC = () => {
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;
    socket.socket.emit("message", "hey");

    socket.socket.on("update", (operation: {taskObjectId: string, afterValue: number}) => {
      console.log(operation);
      dispatch(setValue(operation.taskObjectId, operation.afterValue)); // サーバでのバリデーションを信じる
    });

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
