import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { Route, Routes } from 'react-router';
import { RootState } from 'slices';
import { scoreStateSlice } from 'slices/score';
import { phaseStateSlice } from 'slices/phase';
import { teamsStateSlice } from 'slices/teams';
import { connectedDevicesStateSlice } from 'slices/connectedDevices';
import { connectionState } from 'atoms/connectionState';
import { HomePage } from 'pages/HomePage';
import { ScoreInputPage } from 'pages/ScoreInputPage';
import { AdminPage } from 'pages/AdminPage';
import { StreamingOverlayPage } from 'pages/StreamingOverlayPage';
import { ScreenPage } from 'pages/ScreenPage';
import { LocalTimerClock } from 'functional/LocalTimerClock';
import { GetDeviceName } from 'components/SettingModal';
import { LoadingOverlay } from 'ui/LoadingOverlay';
import { LyricalSocket } from 'lyricalSocket';
import { AppMuiThemeProvider } from 'AppMuiThemeProvider';
import "dseg/css/dseg.css";

type WelcomeData = {
  time: number,
  state: RootState,
};

const App: FC = () => {
  const [isConnect, setIsConnect] = useRecoilState(connectionState);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: WelcomeData) => {
      console.debug(`welcome: ${socket.id}`, data);
      dispatch(scoreStateSlice.actions.setCurrent(data.state.score));
      dispatch(phaseStateSlice.actions.setCurrent(data.state.phase));
      dispatch(teamsStateSlice.actions.setCurrent(data.state.teams));
      dispatch(connectedDevicesStateSlice.actions.setCurrent(data.state.connectedDevices));
      setIsConnect(true);

      const delayTime = Date.now() - data.time;
      console.log(`ふぇぇ…サーバとの時刻遅れは${delayTime}msだよぉ`);

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

  return <>
    <AppMuiThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
        <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/streaming_overlay" element={<StreamingOverlayPage />} />
        <Route path="/screen" element={<ScreenPage />} />
      </Routes>
      <LoadingOverlay loading={!isConnect}/>
      <LocalTimerClock />
    </AppMuiThemeProvider>
  </>;
}

export default App;
