import { config } from '@rolimoa/common/config';
import { scoreStateSlice } from '@rolimoa/common/redux';
import { phaseStateSlice } from '@rolimoa/common/redux';
import { matchStateSlice } from '@rolimoa/common/redux';
import { operationLogsStateSlice } from '@rolimoa/common/redux';
import { resultRecordsStateSlice } from '@rolimoa/common/redux';
import { connectedDevicesStateSlice } from '@rolimoa/common/redux';
import { streamingInterfaceSlice } from '@rolimoa/common/redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router';
import { useRecoilState } from 'recoil';
import { connectionState } from '~/atoms/connectionState';
import { useAppRootTimer } from '~/functional/useAppRootTimer';
import { useLoadSetting } from '~/functional/useLoadSetting';
import { AdminPage } from '~/pages/AdminPage';
import { HomePage } from '~/pages/HomePage';
import { RefereePage } from '~/pages/RefereePage';
import { ScoreInputPage } from '~/pages/ScoreInputPage';
import { ScreenPage } from '~/pages/ScreenPage';
import { StreamingOverlayOpenerPage } from '~/pages/StreamingOverlayOpenerPage';
import { StreamingOverlayPage } from '~/pages/StreamingOverlayPage';
import { LoadingOverlay } from '~/ui/LoadingOverlay';
import { AppMuiThemeProvider } from './AppMuiThemeProvider';
import { ShortcutKeyProvider } from './functional/useShortcutKey';
import { LyricalSocket } from './lyricalSocket';
import { getSetting } from './util/clientStoredSetting';
import 'dseg/css/dseg.css';

const App = () => {
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
        dispatch(operationLogsStateSlice.actions.setState(data.state.operationLogs));
        dispatch(resultRecordsStateSlice.actions.setState(data.state.resultRecords));
        dispatch(connectedDevicesStateSlice.actions.setState(data.state.connectedDevices));
        dispatch(streamingInterfaceSlice.actions.setState(data.state.streamingInterface));
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
        <ShortcutKeyProvider>
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
          <LoadingOverlay loading={!config.client.standalone_mode && !isConnect} />
        </ShortcutKeyProvider>
      </AppMuiThemeProvider>
    </>
  );
};

export default App;
