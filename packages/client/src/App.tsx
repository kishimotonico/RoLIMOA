import { type FC, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import type { AnyAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { scoreStateSlice } from '@/slices/score';
import { phaseStateSlice } from '@/slices/phase';
import { matchStateSlice } from '@/slices/match';
import { operationLogsStateSlice } from './slices/operationLogs';
import { resultRecordsStateSlice } from '@/slices/resultRecord';
import { connectedDevicesStateSlice } from '@/slices/connectedDevices';
import { streamingInterfaceSlice } from '@/slices/streamingInterface';
import { connectionState } from '@/atoms/connectionState';
import { HomePage } from '@/pages/HomePage';
import { RefereePage } from '@/pages/RefereePage';
import { ScoreInputPage } from '@/pages/ScoreInputPage';
import { AdminPage } from '@/pages/AdminPage';
import { StreamingOverlayPage } from '@/pages/StreamingOverlayPage';
import { StreamingOverlayOpenerPage } from '@/pages/StreamingOverlayOpenerPage';
import { ScreenPage } from '@/pages/ScreenPage';
import { LoadingOverlay } from '@/ui/LoadingOverlay';
import { useAppRootTimer } from '@/functional/useAppRootTimer';
import { useLoadSetting } from '@/functional/useLoadSetting';
import { config } from '@/config/load';
import { LyricalSocket } from './lyricalSocket';
import { AppMuiThemeProvider } from './AppMuiThemeProvider';
import { getSetting } from './util/clientStoredSetting';
import 'dseg/css/dseg.css';

const App: FC = () => {
  const [isConnect, setIsConnect] = useRecoilState(connectionState);
  const location = useLocation();
  const dispatch = useDispatch();

  useLoadSetting();

  useAppRootTimer();

  // websocketの初回接続と受信イベント処理
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (config.client.standalone_mode) {
      console.log('スタンドアロンモードなので、Websocketを使わないよ');
      return;
    }

    const socket = LyricalSocket.instance.socket;

    socket.onopen = () => {
      console.log('WebSocket接続が確立されました');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'welcome') {
        console.debug('welcome', data);
        dispatch(scoreStateSlice.actions.setState(data.state.score));
        dispatch(phaseStateSlice.actions.setState(data.state.phase.current));
        dispatch(matchStateSlice.actions.setState(data.state.match));
        dispatch(
          operationLogsStateSlice.actions.setState(data.state.operationLogs),
        );
        dispatch(
          resultRecordsStateSlice.actions.setState(data.state.resultRecords),
        );
        dispatch(
          connectedDevicesStateSlice.actions.setState(
            data.state.connectedDevices,
          ),
        );
        dispatch(
          streamingInterfaceSlice.actions.setState(
            data.state.streamingInterface,
          ),
        );
        setIsConnect(true);
        LyricalSocket.setSessionId(data.sid);

        const delayTime = Date.now() - data.time;
        console.log(`ふぇぇ…サーバとの時刻遅れは${delayTime}msだよぉ`);
      }
      if (data.type === 'dispatch' || data.type === 'dispatch_all') {
        console.debug('dispatch from server', data);
        for (const action of data.actions) {
          dispatch(action);
        }
      }
    };

    socket.onclose = (ev) => {
      console.error('WebSocket接続が閉じられました', ev);
      setIsConnect(false);
    };

    socket.onerror = (ev) => {
      console.error('WebSocketエラーが発生しました', ev);
    };
  }, []);

  // ページ遷移時に、表示ページのパスを更新する
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isConnect) {
      LyricalSocket.dispatch(
        connectedDevicesStateSlice.actions.addDeviceOrUpdate({
          sockId: LyricalSocket.getSessionId(),
          deviceName: getSetting().deviceName,
          currentPath: location.pathname,
        }),
        dispatch,
      );
    }
  }, [isConnect, location]);

  return (
    <>
      <AppMuiThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/referee" element={<RefereePage />} />
          <Route
            path="/score/red"
            element={<ScoreInputPage fieldSide="red" />}
          />
          <Route
            path="/score/blue"
            element={<ScoreInputPage fieldSide="blue" />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/streaming-overlay-opener"
            element={<StreamingOverlayOpenerPage />}
          />
          <Route path="/streaming-overlay" element={<StreamingOverlayPage />} />
          <Route path="/screen" element={<ScreenPage />} />
        </Routes>
        <LoadingOverlay
          loading={!config.client.standalone_mode && !isConnect}
        />
      </AppMuiThemeProvider>
    </>
  );
};

export default App;
