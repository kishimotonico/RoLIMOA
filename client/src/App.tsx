import React, { FC, useEffect } from 'react';
import { ScoreInputPage } from './ScoreInputPage';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { FieldSideType, WholeTaskState, PhaseState, RootState, connectionStateSlice, phaseStateSlice, taskStateSlice } from './store';
import { HomePage } from './HomePage';
import { LoadingOverlay } from "./LoadingOverlay";
import { AdminPage } from './AdminPage';

const App: FC = () => {
  const isConnect = useSelector<RootState, boolean>((state) => state.connection);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;

    socket.socket.on("welcome", (data: {taskStatus: WholeTaskState, phaseState: PhaseState}) => {
      console.log("welcome", data);
      dispatch(taskStateSlice.actions.setCurrent(data.taskStatus));
      dispatch(phaseStateSlice.actions.setCurrent(data.phaseState));
      dispatch(connectionStateSlice.actions.setCurrent(true));
    });

    socket.socket.io.on("reconnect_attempt", () => {
      dispatch(connectionStateSlice.actions.setCurrent(false));
    });

    socket.socket.on("update", (operation: {fieldSide: FieldSideType, taskObjectId: string, afterValue: number}) => {
      console.log("update", operation);
      dispatch(taskStateSlice.actions.setTaskUpdate(operation));
    });

    socket.socket.on("phase_update", (operation: PhaseState) => {
      console.log("phase_update", operation);
      dispatch(phaseStateSlice.actions.setCurrent(operation));
    });
  }, [dispatch]);

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
