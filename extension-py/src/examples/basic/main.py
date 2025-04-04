"""
RoLIMOAExtensionのかんたんなサンプルコードです

- 同じdispatchに対して複数のコールバック関数を登録することができます
- `task/setTaskUpdate` などはRoLIMOAのReduxのactionに対応しています
- 時間経過を待ちたい場合 `time.sleep()` でなく `asyncio.sleep()` を使います
"""

from logging import getLogger, StreamHandler, DEBUG
import os
import asyncio
from rolimoa_extension import RoLIMOAExtension

# ロガーの設定
logger = getLogger("RoLIMOAExtension")
handler = StreamHandler()
handler.setLevel(DEBUG)
logger.setLevel(DEBUG)
logger.addHandler(handler)

url = os.environ.get("RoLIMOA_WS_URL", "ws://localhost:8000/ws")
ext = RoLIMOAExtension(url, logger=logger)

@ext.on_dispatch("task/setTaskUpdate")
async def on_task_update_1(payload: dict):
    fieldSide = payload["fieldSide"]
    taskObject = payload["taskObjectId"]
    afterValue = payload["afterValue"]

    print(f"on_task_update_1: {fieldSide}の{taskObject}が{afterValue}に更新されました")

    await asyncio.sleep(5.24)
    print(f"5.24秒たった！ {taskObject}({fieldSide})->{afterValue}")

@ext.on_dispatch("task/setTaskUpdate")
async def on_task_update_2(payload: dict):
    fieldSide = payload["fieldSide"]
    taskObject = payload["taskObjectId"]
    afterValue = payload["afterValue"]

    print(f"on_task_update_2: {fieldSide}の{taskObject}が{afterValue}に更新されました")

    await asyncio.sleep(3)
    print(f"3秒たった！ {taskObject}({fieldSide})->{afterValue}")

asyncio.run(ext.connect())
