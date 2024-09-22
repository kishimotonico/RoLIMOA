from typing import NamedTuple, Awaitable, Callable, List
import asyncio
import httpx_ws
import json

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
            verbose=False,
            reconnect_interval=5
        ):
        self.url = url
        self.device_name = device_name
        self.on_open_callback = on_open
        self.on_close_callback = on_close
        self.on_error_callback = on_error
        self.verbose = verbose
        self.reconnect_interval = reconnect_interval
        self.session_id = ""
        self.on_dispatchs: List[RoLIMOAExtension.EventListener] = []

    async def connect(self):
        while True:
            try:
                with httpx_ws.connect_ws(self.url) as ws:
                    self.ws = ws
                    if self.on_open_callback:
                        self.on_open_callback(ws)
                    self.listen(ws)
            except Exception as e:
                if self.on_error_callback:
                    self.on_error_callback(None, e)
                if not isinstance(e, httpx_ws.WebSocketNetworkError):
                    raise e
                await asyncio.sleep(self.reconnect_interval) # 再接続までの待機時間

    def listen(self, ws: httpx_ws.WebSocketSession):
        while True:
            message = ws.receive_text()
            self.on_message(ws, message)

    def on_message(self, ws, message):
        if self.verbose:
            print(f"on_message: {message}")

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
                for listener in self.on_dispatchs:
                    if listener.type == type:
                        listener.callback(payload)

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
            self.on_dispatchs.append(self.EventListener(action_type, callback))
            return callback

        return decorator

    def on_open(self, ws):
        if self.verbose:
            print("Connected!")

        if self.on_open_callback is not None:
            self.on_open_callback(ws)

    def on_close(self, ws, close_status_code, close_msg):
        if self.verbose:
            print(f"Disconnected! {close_status_code} {close_msg}")

        if self.on_close_callback is not None:
            self.on_close_callback(ws, close_status_code, close_msg)

    def on_error(self, ws, error):
        if self.verbose:
            print(f"Error! {error}")

        if self.on_error_callback is not None:
            self.on_error_callback(ws, error)


async def main():
    ext = RoLIMOAExtension("ws://localhost:8000/ws", verbose=True)

    @ext.on_dispatch("task/setTaskUpdate")
    def on_task_update(payload: dict):
        fieldSide = payload["fieldSide"]
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]

        print(f"{fieldSide}チームの{taskObject}が{afterValue}に更新されました")

    @ext.on_dispatch("task/setGlobalUpdate")
    def on_global_update(payload: dict):
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]

        print(f"{taskObject}が{afterValue}に更新されました")

    await ext.connect()

if __name__ == "__main__":
    asyncio.run(main())