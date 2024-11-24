from typing import NamedTuple, Any, Awaitable, Callable, List, Union, Optional, Coroutine
import asyncio
import httpx_ws
import json
from logging import getLogger, StreamHandler

class RoLIMOAExtension:
    class EventListener(NamedTuple):
        type: str
        callback: Callable[[dict], Awaitable[None]]

    def __init__(
            self,
            url,
            device_name="extension/example",
            on_open=None,
            on_close=None,
            on_error=None,
            logger=None,
            reconnect_interval=5
        ):
        self.url = url
        self.device_name = device_name
        self.on_open_callback = on_open
        self.on_error_callback = on_error
        self.logger = logger or getLogger(self.__class__.__name__)
        self.reconnect_interval = reconnect_interval
        self.session_id = ""
        self.on_dispatch_callbacks: List[RoLIMOAExtension.EventListener] = []
        self.callback_tasks = set()

    def _callback_invoke(self, func: Union[None, Callable[[Any], Awaitable[Any]], Callable[[Any], Any]], args: list):
        if func is None:
            return
        elif asyncio.iscoroutinefunction(func):
            # 非同期なタスクを作成
            task = asyncio.create_task(func(*args))
            task.add_done_callback(self.callback_tasks.discard)
            self.callback_tasks.add(task)
        else:
            # 単純に関数を同期的に呼び出し
            func(*args)

    async def connect(self):
        while True:
            try:
                async with httpx_ws.aconnect_ws(self.url) as ws:
                    self.ws = ws
                    self.logger.info("Connected to RoLIMOA server")
                    self._callback_invoke(self.on_open_callback, [ws])
                    await self.listen(ws)
            except Exception as e:
                self._callback_invoke(self.on_error_callback, [e])
                if not isinstance(e, httpx_ws.WebSocketNetworkError):
                    raise e
                await asyncio.sleep(self.reconnect_interval) # 再接続までの待機時間

    async def listen(self, ws: httpx_ws.AsyncWebSocketSession):
        while True:
            message = await ws.receive_text()
            await self.on_message(ws, message)

    async def on_message(self, ws, message):
        self.logger.debug(f"on_message: {message}")

        body = json.loads(message)
        if body["type"] == "welcome":
            self.session_id = body["sid"]
            self.dispatch("connectedDevices/addDeviceOrUpdate", {
                "sockId": self.session_id,
                "deviceName": self.device_name,
                "currentPath": "(CLI)"
            })

        if body["type"] == "dispatch" or body["type"] == "dispatch_all":
            actions = body["actions"]
            for action in actions:
                type = action["type"]
                payload = action["payload"]
                for listener in self.on_dispatch_callbacks:
                    if listener.type == type:
                        self._callback_invoke(listener.callback, [payload])

    def dispatch(self, type: str, payload: dict):
        """
        サーバーに更新(Reduxのaction)を送信する関数
        """
        asyncio.create_task(self._send_dispatch(type, payload))

    async def _send_dispatch(self, type: str, payload: dict):
        async with httpx_ws.aconnect_ws(self.url) as ws:
            await ws.send_text(json.dumps({
                "type": "dispatch",
                "actions": [
                    {
                        "type": type,
                        "payload": payload
                    }
                ]
            }, ensure_ascii=False))

    def on_dispatch(self, action_type: str):
        """
        サーバーから更新を受信したときのコールバック関数のデコレータ
        """
        def decorator(callback: Callable[[dict], None]):
            self.on_dispatch_callbacks.append(self.EventListener(action_type, callback))
            return callback

        return decorator


async def main():
    ext = RoLIMOAExtension("ws://localhost:8000/ws")

    @ext.on_dispatch("task/setTaskUpdate")
    async def on_task_update_1(payload: dict):
        fieldSide = payload["fieldSide"]
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]

        print(f"{fieldSide}の{taskObject}が{afterValue}に更新されました")

        await asyncio.sleep(5.24)
        print(f"5.24秒たった！ {taskObject}({fieldSide})->{afterValue}")

    @ext.on_dispatch("task/setTaskUpdate")
    async def on_task_update_2(payload: dict):
        fieldSide = payload["fieldSide"]
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]

        print(f"{fieldSide}の{taskObject}が{afterValue}に更新されました")

        await asyncio.sleep(3)
        print(f"3秒たった！ {taskObject}({fieldSide})->{afterValue}")

    await ext.connect()

if __name__ == "__main__":
    asyncio.run(main())