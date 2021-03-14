import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { createStore } from "redux";
import { rootReducer } from "./store";

const app = express();
const server = http.createServer(app).listen(8000);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
}) as Server;

// クライアントのホスティング
app.use(express.static('../client/build'));


// Redux ストアを生成
const store = createStore(rootReducer);

io.on('connection', (socket: Socket) => {
    console.log(`connected: ${socket.id}`);
    // 初回接続したクライアントに、現在の試合状況を送信する
    io.to(socket.id).emit('welcome', store.getState());

    // 切断
    socket.on('disconnect', (reason) => {
        console.log(`disconnect: ${socket.id} (${reason})`);
    });

    // クライアントから送られたdispatchの処理
    socket.on('dispatch', (action) => {
        console.log(`on dispatch (${socket.id})`, action);

        store.dispatch(action);                     // サーバサイドのストアに反映
        socket.broadcast.emit('dispatch', action);  // 送信元以外にdispatchを転送

        // FIXME: actionを送信元にも送る場合
        if (action.type.includes("phase") | action.type.includes("teams")) {
            io.to(socket.id).emit('dispatch', action);
        }
    });
});

console.log('server start');
