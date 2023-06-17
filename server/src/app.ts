import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { createStore } from "redux";
import { rootReducer } from "./features";
import { connectedDevicesStateSlice } from "./features/connectedDevices";
import { format } from "date-fns";
import path from "path";
import fs from "fs";

const app = express();
const server = http.createServer(app).listen(8000);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173", // CORSなくても動くかも？
        methods: ["GET", "POST"],
    }
}) as Server;

// クライアントのホスティング
app.use(express.static("../client/dist"));
app.get("*", (req, res, next) => {
    res.sendFile(path.resolve("../client/dist/index.html"));
});


let initialState = undefined;
const latestSaveFile = fs.readdirSync("./save").filter((file) => file.endsWith('.json')).sort().reverse()[0];
if (latestSaveFile) {
    console.log(`${latestSaveFile}が見つかったため、ストアを復元します`);
    initialState = JSON.parse(fs.readFileSync(`./save/${latestSaveFile}`, "utf-8"));
    // 復元しない項目を無理やり初期化
    initialState.connectedDevices = []; 
}

const store = createStore(rootReducer, initialState);

io.on("connection", (socket: Socket) => {
    console.log(`connected: ${socket.id}`);
    // 初回接続したクライアントに、現在の試合状況を送信する
    io.to(socket.id).emit("welcome", {
        time: Date.now(),
        state: store.getState(),
    });

    // 切断
    socket.on("disconnect", (reason) => {
        console.log(`disconnect: ${socket.id} (${reason})`);

        const action = connectedDevicesStateSlice.actions.removeDevice({
            sockId: socket.id
        });
        store.dispatch(action);
        io.emit("dispatch", [action]);
    });

    // クライアントから送られたdispatchの処理
    socket.on("dispatch", (actions: any[]) => {
        console.debug(`on dispatch (${socket.id})`, actions);

        actions.forEach((action) => {
            store.dispatch(action);                 // サーバサイドのストアに反映
        });
        socket.broadcast.emit("dispatch", actions);  // 送信元以外にactionを転送
    });
    socket.on("dispatch_all", (actions: any[]) => {
        console.debug(`on dispatch_all (${socket.id})`, actions);

        actions.forEach((action) => {
            store.dispatch(action);                 // サーバサイドのストアに反映
        });
        io.emit("dispatch", actions);                // 送信元を含む全てに転送
    });

    // クライアントから保存指示が送られたとき
    socket.on("save_store", async () => {
        const storeStaet = store.getState();

        const datetime = format(new Date(), "yyyyMMddHHmmss");
        const filePath = `./save/store_${datetime}.json`;
        fs.writeFileSync(filePath, JSON.stringify(storeStaet), {
            encoding: "utf-8",
        });
        console.log(`succeeded save file: ${filePath}`);
    });
});

console.log("server start");
