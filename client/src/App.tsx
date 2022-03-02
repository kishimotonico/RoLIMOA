import React, { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { RootState } from './features';
import { scoreStateSlice } from './features/score';
import { phaseStateSlice } from './features/phase';
import { teamsStateSlice } from './features/teams';
import { connectionState } from './atoms/connectionState';
import { HomePage } from './HomePage';
import { LoadingOverlay } from "./LoadingOverlay";
import { ScoreInputPage } from './ScoreInputPage';
import { AdminPage } from './AdminPage';
import { StreamingOverlayPage } from './StreamingOverlayPage';
import { LyricalSocket } from './lyricalSocket';
import { LocalTimerClock } from './LocalTimerClock';

const App: FC = () => {
  const [isConnect, setIsConnect] = useRecoilState(connectionState);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: RootState) => {
      console.log("welcome", data);
      dispatch(scoreStateSlice.actions.setCurrent(data.score));
      dispatch(phaseStateSlice.actions.setCurrent(data.phase));
      dispatch(teamsStateSlice.actions.setCurrent(data.teams));
      setIsConnect(true);
    });

    socket.io.on("reconnect_attempt", () => {
      setIsConnect(false);
    });

    socket.on("dispatch", (action: any) => {
      console.log("dispatch from server", action);
      dispatch(action);
    });
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
        <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/streaming_overlay" element={<StreamingOverlayPage />} />
      </Routes>
      <LoadingOverlay loading={!isConnect}/>
      <LocalTimerClock />
    </>
  );
}
  
export default App;
