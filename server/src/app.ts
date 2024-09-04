import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { createStore } from "redux";
import { rootReducer } from "./features";
import { connectedDevicesStateSlice } from "./features/connectedDevices";
import { format } from "date-fns";
import path from "path";
import crypt from "crypto";
import fs from "fs";
import WebSocket, { WebSocketServer } from 'ws';

let initialState = undefined;
const latestSaveFile = fs.readdirSync("./save").filter((file) => file.endsWith('.json')).sort().reverse()[0];
if (latestSaveFile) {
    console.log(`${latestSaveFile}が見つかったため、ストアを復元します`);
    initialState = JSON.parse(fs.readFileSync(`./save/${latestSaveFile}`, "utf-8"));
    // 復元しない項目を無理やり初期化
    initialState.connectedDevices = []; 
}

const store = createStore(rootReducer, initialState);

const wss = new WebSocketServer({
    port: 8000,
    host: '0.0.0.0',
});

wss.on('connection', (ws) => {
    const sessionId = crypt.randomUUID();
    console.log(`connected (sid: ${sessionId})`);

    // 初回接続したクライアントに、現在の試合状況を送信する
    ws.send(JSON.stringify({
        type: 'welcome',
        time: Date.now(),
        state: store.getState(),
        sid: sessionId,
    }));

    // 切断
    ws.on('close', (code, reason) => {
        console.log(`disconnect (sid: ${sessionId}): ${code} ${reason}`);

        const action = connectedDevicesStateSlice.actions.removeDevice({
            sockId: sessionId,
        });
        store.dispatch(action);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify([action]));
            }
        });
    });

    // クライアントから送られたdispatchの処理
    ws.on('message', (message) => {
        const body = JSON.parse(message.toString());
        const type = body?.type;
        const actions = body?.actions;
        console.log(`on message: `, body);

        actions.forEach((action) => {
            store.dispatch(action);
        });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

console.log("server start");
