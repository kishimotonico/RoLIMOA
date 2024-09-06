from typing import NamedTuple, Callable, List
import websocket
import json

class RoLIMOAExtension:
    class EventListener(NamedTuple):
        type: str
        callback: Callable[[dict], None]

    def __init__(
            self,
            url,
            device_name = "extension/example",
            on_open = None,
            on_close = None,
            on_error = None,
            verbose = False,
        ):
        self._uri = url
        self._device_name = device_name
        self._on_open = on_open
        self._on_close = on_close
        self._on_error = on_error
        self._vervose = verbose
        self._ws = None
        self._session_id = ""
        self._on_dispatchs: List[self.EventListener] = []

    def connect(self):
        self.ws = websocket.WebSocketApp(
            self._uri,
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
            on_error=self.on_error,
        )
        self.ws.run_forever(reconnect=5)

    def dispatch(self, type: str, payload: dict):
        self.ws.send(json.dumps({
            "type": "dispatch",
            "actions": [
                {
                    "type": type,
                    "payload": payload
                }
            ]
        }, ensure_ascii=False))

    def add_on_dispatch(self, type: str, callback: Callable[[dict], None]):
        self._on_dispatchs.append(self.EventListener(type, callback))

    def on_message(self, ws, message):
        if self._vervose:
            print(f"on_message: {message}")

        body = json.loads(message)
        if body["type"] == "welcome":
            self._session_id = body["sid"]
            self.dispatch("connectedDevices/addDeviceOrUpdate", {
                "sockId": self._session_id,
                "deviceName": self._device_name,
                "currentPath": "(CLI)"
            })

        if body["type"] == "dispatch" or body["type"] == "dispatch_all":
            actions = body["actions"]
            for action in actions:
                type = action["type"]
                payload = action["payload"]
                for listener in self._on_dispatchs:
                    if listener.type == type:
                        listener.callback(payload)

    def on_open(self, ws):
        if self._vervose:
            print("Connected!")

        if self._on_open is not None:
            self._on_open(ws)

    def on_close(self, ws, close_status_code, close_msg):
        if self._vervose:
            print(f"Disconnected! {close_status_code} {close_msg}")

        if self._on_close is not None:
            self._on_close(ws, close_status_code, close_msg)

    def on_error(self, ws, error):
        if self._vervose:
            print(f"Error! {error}")

        if self._on_error is not None:
            self._on_error(ws, error)


if __name__ == "__main__":
    ext = RoLIMOAExtension("ws://localhost:8000/ws")

    def on_task_update(payload: dict):
        fieldSide = payload["fieldSide"]
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]
        print(f"{fieldSide}チームの{taskObject}が{afterValue}に更新されました")

    def on_global_update(payload: dict):
        taskObject = payload["taskObjectId"]
        afterValue = payload["afterValue"]
        print(f"{taskObject}が{afterValue}に更新されました")

    ext.add_on_dispatch("task/setTaskUpdate", on_task_update)
    ext.add_on_dispatch("task/setGloablUpdate", on_global_update)
    ext.connect()
