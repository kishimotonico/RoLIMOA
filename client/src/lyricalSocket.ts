import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import io from "socket.io-client";

export class LyricalSocket {
  // singleton
  private static _instance:LyricalSocket;
  public static get instance():LyricalSocket {
    if (!this._instance) {
      this._instance = new LyricalSocket();
    }
    return this._instance;
  }

  public readonly socket: SocketIOClient.Socket;

  private constructor() {
    this.socket = io(":8000", {
      transports:['websocket'],
    });
    console.log(`is connected: ${this.socket.connected}`);
  }

  // サーバを経由して、別のクライアントにactionをdispatchする
  public static dispatch(action: AnyAction, reduxDispatch: Dispatch<any> | undefined = undefined) {
    if (reduxDispatch) {
      reduxDispatch(action);
    }
    this._instance.socket.emit("dispatch", action);
  }

  // サーバを経由して、自分を含めた全クライアントにactionをdispatchする
  public static dispatchAll(action: AnyAction) {
    this._instance.socket.emit("dispatch_all", action);
  }
}
