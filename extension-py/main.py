import websocket
import json

URI = "ws://localhost:8000/ws"
DEVICE_NAME = "extension/example"
SESSION_ID = ""

def on_open(ws):
    print("Connected!")

def on_message(ws, message):
    global SESSION_ID
    print(f"on_message: {message}")

    body = json.loads(message)
    if body["type"] == "welcome":
        SESSION_ID = body["sid"]

        ws.send(json.dumps({
            "type": "dispatch",
            "actions": [
                {
                    "type": "connectedDevices/addDeviceOrUpdate",
                    "payload": {
                        "sockId": SESSION_ID,
                        "deviceName": DEVICE_NAME,
                        "currentPath": "(CLI)"
                    }
                }
            ]
        }, ensure_ascii=False))

def on_close(ws, close_status_code, close_msg):
    print(f"Disconnected! {close_status_code} {close_msg}")

def on_error(ws, error):
    print(error)

if __name__ == "__main__":
    ws = websocket.WebSocketApp(URI, on_open=on_open, on_message=on_message, on_close=on_close, on_error=on_error)
    ws.run_forever( reconnect=5)
