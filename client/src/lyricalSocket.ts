import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

export class LyricalSocket {
  // singleton
  private static _instance: LyricalSocket;
  public static get instance():LyricalSocket {
    if (!this._instance) {
      this._instance = new LyricalSocket();
    }
    return this._instance;
  }

  public readonly socket: Socket;

  private constructor() {
    this.socket = io(":8000", {
      transports:['websocket'],
    });
    console.log(`is connected: ${this.socket.connected}`);
  }

  // サーバを経由して、別のクライアントにactionをdispatchする
  public static dispatch(actions: AnyAction[] | AnyAction, reduxDispatch: Dispatch<any> | undefined = undefined) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!Array.isArray(actions)) {
      actions = [actions];
    }

    if (reduxDispatch) {
      actions.forEach(action => {
        reduxDispatch(action);
      });
    }
    this._instance.socket.emit("dispatch", actions);
  }

  // サーバを経由して、自分を含めた全クライアントにactionをdispatchする
  public static dispatchAll(actions: AnyAction[]) {
    this._instance.socket.emit("dispatch_all", actions);
  }
}
