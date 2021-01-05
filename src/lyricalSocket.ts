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
}
