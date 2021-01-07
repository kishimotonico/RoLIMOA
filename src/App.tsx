import React, { FC, useEffect } from 'react';
import { ScoreInputPage } from './ScoreInputPage';
import { LyricalSocket } from './lyricalSocket';
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
    <ScoreInputPage fieldSide="red" />
  );
}

export default App;
