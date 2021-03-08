import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import { UpdateOperation, WholeTaskStateController } from './model';
import { PhaseManager, configHelper } from "./timer";
import config from './config.json';

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


const taskStatus = WholeTaskStateController.initializeByConfig(config.rule.task_objects);
const phaseState = PhaseManager.initializedByConfig(configHelper(config.time_progress));

io.on('connection', (socket: Socket) => {
    console.log(`connected: ${socket.id}`);
    // 初回接続したクライアントに、現在の試合状況を送信する
    io.to(socket.id).emit('welcome', {
        taskStatus: taskStatus.toSerialize(),
        phaseState: phaseState.getState(),
    });

    // 切断
    socket.on('disconnect', (reason) => {
        console.log(`disconnect: ${socket.id} (${reason})`);
    });

    // 得点の更新リクエスト
    socket.on('update', (data: UpdateOperation) => {
        console.log(`on update (${socket.id})`, data);
        taskStatus.applyOperation(data);

        socket.broadcast.emit('update', data);  // 送信元以外に送信
        io.to(socket.id).emit('accept', data);  // 送信元だけに返信
    });

    // フェーズ状況の更新セット
    socket.on('phase_update', (data: {
        id: string,
        startTime?: number,
    }) => {
        console.log(`on phase_update (${socket.id})`, data);
        phaseState.applyOperation(data);

        io.emit('phase_update', phaseState.getState());
    });
});

console.log('server start');