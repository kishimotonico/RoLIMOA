import React, { FC, useEffect } from 'react';
import { ScoreInputPage } from './ScoreInputPage';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskStateAll, setTaskObjectValue, setIsConnect } from "./actions";
import { Route, Routes } from 'react-router';
import { HomePage } from './HomePage';
import { FieldSideType, GlobalState, WholeTaskState } from './reducer';
import { LoadingOverlay } from "./LoadingOverlay";
import { AdminPage } from './AdminPage';

const App: FC = () => {
  const isConnect = useSelector<GlobalState, boolean>((state) => state.isConnect);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;

    socket.socket.on("welcome", (currentState: WholeTaskState) => {
      console.log("welcome", currentState);
      dispatch(setTaskStateAll(currentState));
      dispatch(setIsConnect(true));
    });

    socket.socket.io.on("reconnect_attempt", () => {
      dispatch(setIsConnect(false));
    });

    socket.socket.on("update", (operation: {fieldSide: FieldSideType, taskObjectId: string, afterValue: number}) => {
      console.log("update", operation);
      dispatch(setTaskObjectValue(operation.fieldSide, operation.taskObjectId, operation.afterValue)); // サーバでのバリデーションを信じる
    });
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
        <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <LoadingOverlay loading={!isConnect}/>
    </>
  );
}
  
export default App;
