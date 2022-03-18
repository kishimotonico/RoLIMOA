import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { Route, Routes, useLocation } from 'react-router';
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
import { AppRootTimer } from 'functional/AppRootTimer';
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
  const location = useLocation();
  const dispatch = useDispatch();

  // websocketの初回接続と受信イベント処理
  useEffect(() => {
    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: WelcomeData) => {
      console.debug(`welcome: ${socket.id}`, data);
      dispatch(scoreStateSlice.actions.setCurrent(data.state.score));
      dispatch(phaseStateSlice.actions.setCurrent(data.state.phase.current));
      dispatch(teamsStateSlice.actions.setCurrent(data.state.teams));
      dispatch(connectedDevicesStateSlice.actions.setCurrent(data.state.connectedDevices));
      setIsConnect(true);

      const delayTime = Date.now() - data.time;
      console.log(`ふぇぇ…サーバとの時刻遅れは${delayTime}msだよぉ`);

      const action = connectedDevicesStateSlice.actions.addDevice({
        sockId: socket.id,
        currentPath: location.pathname,
        deviceName: GetDeviceName(),
      });

      LyricalSocket.dispatch(action, dispatch);
    });

    socket.io.on("reconnect_attempt", () => {
      setIsConnect(false);
    });

    socket.on("dispatch", (action: any) => {
      console.debug("dispatch from server", action);
      dispatch(action);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ページ遷移時に、表示ページのパスを更新する
  useEffect(() => {
    if (isConnect) {
      const sockId = LyricalSocket.instance.socket.id;
      const currentPath = location.pathname;
      console.log(`${sockId}が${currentPath}にページ遷移したよぉ`);
      LyricalSocket.dispatch(connectedDevicesStateSlice.actions.updatePath({
        sockId,
        currentPath,
      }), dispatch);
    }
  }, [isConnect, location]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <AppRootTimer />
    </AppMuiThemeProvider>
  </>;
}

export default App;
