import express from "express";
import expressWs from 'express-ws';
import WebSocket from 'ws';
import { createStore } from "redux";
import { rootReducer } from "./features";
import { connectedDevicesStateSlice } from "./features/connectedDevices";
import { format } from "date-fns";
import path from "path";
import crypt from "crypto";
import fs from "fs";

const { app, getWss } = expressWs(express());

const latestSaveFile = fs.readdirSync("./save").filter((file) => file.endsWith('.json')).sort().reverse()[0];
let initialState = undefined;
if (latestSaveFile) {
    console.log(`${latestSaveFile}が見つかったため、ストアを復元します`);
    initialState = JSON.parse(fs.readFileSync(`./save/${latestSaveFile}`, "utf-8"));
    // 復元しない項目を無理やり初期化
    initialState.connectedDevices = [];
}
const store = createStore(rootReducer, initialState);


app.ws('/ws', (ws, req) => {
    const wss = getWss();
    const sessionId = crypt.randomUUID();
    console.log(`connected (sid: ${sessionId})`);

    // 初回接続したクライアントに、現在の試合状況を送信する
    ws.send(JSON.stringify({
        type: 'welcome',
        sid: sessionId,
        time: Date.now(),
        state: store.getState(),
    }));

    // クライアントから送られたdispatchの処理
    ws.on('message', (message) => {
        const body = JSON.parse(message.toString());
        const type = body?.type;
        console.log(`on message: `, body);

        if (type === "dispatch" || type === "dispatch_all") {
            const actions = body?.actions;

            actions.forEach((action) => {
                store.dispatch(action);
            });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        }
        if (type === "save_store") {
            const storeStaet = store.getState();

            const datetime = format(new Date(), "yyyyMMddHHmmss");
            const filePath = `./save/store_${datetime}.json`;
            fs.writeFileSync(filePath, JSON.stringify(storeStaet), {
                encoding: "utf-8",
            });
            console.log(`succeeded save file: ${filePath}`);
        }
    });

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
});

// クライアントのホスティング
app.use(express.static("../client/dist"));
app.get("*", (req, res, next) => {
    res.sendFile(path.resolve("../client/dist/index.html"));
});

app.listen(8000);
console.log("server start");
