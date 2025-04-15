import type { AnyAction, Dispatch } from '@reduxjs/toolkit';
import ReconnectingWebSocket from 'reconnecting-websocket';

export class LyricalSocket {
  // singleton
  private static _instance: LyricalSocket;
  public static get instance(): LyricalSocket {
    if (!LyricalSocket._instance) {
      LyricalSocket._instance = new LyricalSocket();
    }
    return LyricalSocket._instance;
  }

  public readonly socket: ReconnectingWebSocket;
  private sessionId = '';

  private constructor() {
    this.socket = new ReconnectingWebSocket(this.url());
    this.socket.onopen = () => {
      console.log(`is connected: ${this.socket.readyState === WebSocket.OPEN}`);
    };
  }

  private url(): string {
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    return `${scheme}://${host}/ws`;
  }

  public static isActive(): boolean {
    return (
      LyricalSocket.instance.socket &&
      LyricalSocket.instance.socket.readyState === WebSocket.OPEN
    );
  }

  public static setSessionId(sessionId?: string): void {
    LyricalSocket.instance.sessionId = sessionId ?? '';
  }

  public static getSessionId(): string {
    return LyricalSocket.instance.sessionId;
  }

  public static sendOperation(
    operationType: string,
    option: object = {},
  ): void {
    if (!LyricalSocket.isActive()) {
      console.error('WebSocket is not connected');
      return;
    }

    LyricalSocket.instance.socket.send(
      JSON.stringify({
        type: operationType,
        ...option,
      }),
    );
  }

  // サーバを経由して、別のクライアントにactionをdispatchする
  public static dispatch(
    actions: AnyAction[] | AnyAction,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    reduxDispatch: Dispatch<any> | undefined = undefined,
  ) {
    if (!Array.isArray(actions)) {
      // biome-ignore lint/style/noParameterAssign: <explanation>
      actions = [actions];
    }

    if (reduxDispatch) {
      for (const action of actions) {
        reduxDispatch(action);
      }
    }

    LyricalSocket.sendOperation('dispatch', { actions });
  }

  public static dispatchAll(actions: AnyAction[]) {
    LyricalSocket.sendOperation('dispatch_all', { actions });
  }
}
