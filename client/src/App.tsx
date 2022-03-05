import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { Route, Routes } from 'react-router';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { RootState } from './features';
import { scoreStateSlice } from './features/score';
import { phaseStateSlice } from './features/phase';
import { teamsStateSlice } from './features/teams';
import { connectedDevicesStateSlice } from './features/connectedDevices';
import { connectionState } from './atoms/connectionState';
import { HomePage } from './HomePage';
import { LoadingOverlay } from "./LoadingOverlay";
import { ScoreInputPage } from './ScoreInputPage';
import { AdminPage } from './AdminPage';
import { StreamingOverlayPage } from './StreamingOverlayPage';
import { LocalTimerClock } from './LocalTimerClock';
import { GetDeviceName } from './SettingModal';
import { LyricalSocket } from './lyricalSocket';

const theme = createMuiTheme();

const App: FC = () => {
  const [isConnect, setIsConnect] = useRecoilState(connectionState);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: RootState) => {
      console.log(`welcome: ${socket.id}`, data);
      dispatch(scoreStateSlice.actions.setCurrent(data.score));
      dispatch(phaseStateSlice.actions.setCurrent(data.phase));
      dispatch(teamsStateSlice.actions.setCurrent(data.teams));
      dispatch(connectedDevicesStateSlice.actions.setCurrent(data.connectedDevices));
      setIsConnect(true);

      const action = connectedDevicesStateSlice.actions.addDevice({
        sockId: socket.id,
        deviceName: GetDeviceName(),
      });
      dispatch(action)
      socket.emit("dispatch", action);
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
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
          <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/streaming_overlay" element={<StreamingOverlayPage />} />
        </Routes>
        <LoadingOverlay loading={!isConnect}/>
        <LocalTimerClock />
      </ThemeProvider>
    </>
  );
}
  
export default App;
