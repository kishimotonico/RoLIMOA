import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import { type AnyAction, createStore } from 'redux';
import { rootReducer } from '@rolimoa/common/redux';
import { connectedDevicesStateSlice } from '@rolimoa/common/redux';
import path from 'node:path';
import crypt from 'node:crypto';
import { loadFromFile, saveToFile } from './backup.js';

const { app, getWss } = expressWs(express());

const store = createStore(rootReducer, loadFromFile('./save'));

app.ws('/ws', (ws, _req) => {
  const wss = getWss();
  const sessionId = crypt.randomUUID();
  console.log(`connected (sid: ${sessionId})`);

  // 初回接続したクライアントに、現在の試合状況を送信する
  ws.send(
    JSON.stringify({
      type: 'welcome',
      sid: sessionId,
      time: Date.now(),
      state: store.getState(),
    }),
  );

  // クライアントから送られたdispatchの処理
  ws.on('message', async (message) => {
    const body = JSON.parse(message.toString());
    const type = body?.type;
    console.log('on message: ', body);

    if (type === 'dispatch' || type === 'dispatch_all') {
      const clientActions = body?.actions;
      const actions = clientActions.map((action: AnyAction) => {
        if (action.type === 'operationLogs/addLog') {
          return {
            ...action,
            payload: {
              ...action.payload,
              at: Date.now(),
              by: sessionId,
            },
          };
        }
        return action;
      });

      for (const action of actions) {
        store.dispatch(action);
      }

      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type, actions }));
        }
      }
    }
    if (type === 'save_store') {
      await saveToFile('./save', store);
    }
  });

  // 切断
  ws.on('close', (code, reason) => {
    console.log(`disconnect (sid: ${sessionId}): ${code} ${reason}`);

    const action = connectedDevicesStateSlice.actions.removeDevice({
      sockId: sessionId,
    });
    store.dispatch(action);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'dispatch',
            actions: [action],
          }),
        );
      }
    }
  });
});

/**
 * ストアの状態をHTTPで簡単に取得するAPI
 *
 * - `/api/state`
 *     - ストアの全状態を取得(数十KBのJSON)
 * - `/api/state?q=score.fields.blue.tasks.TASK_ID`
 *     - 青コートのタスク"TASK_ID"の値を取得(整数値)
 * - `/api/state?q=connectedDevices`
 *     - 接続中のデバイス一覧を取得(JSON)
 */
app.get('/api/state', (req, res) => {
  const query = req.query.q?.toString();
  const state = store.getState();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let result: any = state;
  if (query) {
    for (const key of query.split('.')) {
      if (result[key] === undefined) {
        res.status(404).send('Not Found');
        break;
      }
      result = result[key];
    }
  }
  res.json(result);
});

// クライアントのホスティング
app.use(express.static('../client/dist'));
app.get('*', (_req, res, _next) => {
  res.sendFile(path.resolve('../client/dist/index.html'));
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT);
console.log('server start');
