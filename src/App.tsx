import React, { FC, useEffect } from 'react';
import { ScoreInputPage } from './ScoreInputPage';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch } from 'react-redux';
import { setTaskStateAll, setTaskObjectValue } from "./actions";
import { Route, Routes } from 'react-router';
import { HomePage } from './HomePage';
import { TaskObjectsType } from './reducer';

const App: FC = () => {
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;

    socket.socket.on("welcome", (currentState: TaskObjectsType) => {
      console.log("welcome", currentState);
      dispatch(setTaskStateAll(currentState)); // サーバでのバリデーションを信じる
    });

    socket.socket.on("update", (operation: {taskObjectId: string, afterValue: number}) => {
      console.log("update", operation);
      dispatch(setTaskObjectValue(operation.taskObjectId, operation.afterValue)); // サーバでのバリデーションを信じる
    });
  });

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
      <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
    </Routes>
  );
}
  
export default App;
