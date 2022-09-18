import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { createStore } from "redux";
import { rootReducer } from "./features";
import { connectedDevicesStateSlice } from "./features/connectedDevices";
import path from "path";

const app = express();
const server = http.createServer(app).listen(8000);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
}) as Server;

// クライアントのホスティング
app.use(express.static("../client/build"));
app.get("*", (req, res, next) => {
    res.sendFile(path.resolve("../client/build/index.html"));
});


// Redux ストアを生成
const store = createStore(rootReducer);

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
        io.emit("dispatch", action);
    });

    // クライアントから送られたdispatchの処理
    socket.on("dispatch", (action) => {
        console.log(`on dispatch (${socket.id})`, action);

        store.dispatch(action);                     // サーバサイドのストアに反映
        socket.broadcast.emit("dispatch", action);  // 送信元以外にactionを転送
    });
    socket.on("dispatch_all", (action) => {
        console.log(`on dispatch_all (${socket.id})`, action);

        store.dispatch(action);                     // サーバサイドのストアに反映
        io.emit("dispatch", action);                // 送信元を含む全てに転送
    });
});

console.log("server start");
