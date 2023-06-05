import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { Route, Routes, useLocation } from 'react-router';
import { RootState } from 'slices';
import { scoreStateSlice } from 'slices/score';
import { phaseStateSlice } from 'slices/phase';
import { matchStateSlice } from 'slices/match';
import { connectedDevicesStateSlice } from 'slices/connectedDevices';
import { connectionState } from 'atoms/connectionState';
import { HomePage } from 'pages/HomePage';
import { RefereePage } from 'pages/RefereePage';
import { ScoreInputPage } from 'pages/ScoreInputPage';
import { AdminPage } from 'pages/AdminPage';
import { StreamingOverlayPage } from 'pages/StreamingOverlayPage';
import { StreamingOverlayOpenerPage } from 'pages/StreamingOverlayOpenerPage';
import { ScreenPage } from 'pages/ScreenPage';
import { AppRootTimer } from 'functional/AppRootTimer';
import { GetDeviceName } from 'components/SettingModal';
import { LoadingOverlay } from 'ui/LoadingOverlay';
import { LyricalSocket } from 'lyricalSocket';
import { AppMuiThemeProvider } from 'AppMuiThemeProvider';
import { config } from 'config/load';
import "dseg/css/dseg.css";
import { resultRecordsStateSlice } from 'slices/resultRecord';
import { streamingInterfaceSlice } from 'slices/streamingInterface';

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
    if (config.client.standalone_mode) {
      console.log("スタンドアロンモードなので、Websocketを使わないよ");
      return;
    }

    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: WelcomeData) => {
      console.debug(`welcome: ${socket.id}`, data);
      dispatch(scoreStateSlice.actions.setState(data.state.score));
      dispatch(phaseStateSlice.actions.setState(data.state.phase.current));
      dispatch(matchStateSlice.actions.setState(data.state.match));
      dispatch(resultRecordsStateSlice.actions.setState(data.state.resultRecords));
      dispatch(connectedDevicesStateSlice.actions.setState(data.state.connectedDevices));
      dispatch(streamingInterfaceSlice.actions.setState(data.state.streamingInterface));
      setIsConnect(true);

      const delayTime = Date.now() - data.time;
      console.log(`ふぇぇ…サーバとの時刻遅れは${delayTime}msだよぉ`);
    });

    socket.io.on("reconnect_attempt", () => {
      setIsConnect(false);
    });

    socket.on("dispatch", (actions: any[]) => {
      console.debug("dispatch from server", actions);
      actions.forEach((action) => {
        dispatch(action);
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ページ遷移時に、表示ページのパスを更新する
  useEffect(() => {
    if (isConnect) {
      LyricalSocket.dispatch(connectedDevicesStateSlice.actions.addDeviceOrUpdate({
        sockId: LyricalSocket.instance.socket.id,
        deviceName: GetDeviceName(),
        currentPath: location.pathname,
      }), dispatch);
    }
  }, [isConnect, location]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <AppMuiThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/referee" element={<RefereePage />} />
        <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
        <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/streaming-overlay-opener" element={<StreamingOverlayOpenerPage />} />
        <Route path="/streaming-overlay" element={<StreamingOverlayPage />} />
        <Route path="/screen" element={<ScreenPage />} />
      </Routes>
      <LoadingOverlay loading={!config.client.standalone_mode && !isConnect}/>
      <AppRootTimer />
    </AppMuiThemeProvider>
  </>;
}

export default App;
