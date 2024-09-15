import asyncio
import httpx_ws

async def main():
    while True:
        try:
            async with httpx_ws.aconnect_ws("ws://localhost:8000/ws") as ws:
                while True:
                    message = await ws.receive_text()
                    print(message)
        except Exception as e:
            print(f"Connection error: {e}")
            await asyncio.sleep(5)  # 再接続までの待機時間

async def start():
    while True:
        try:
            await main()
        except Exception as e:
            print(f"Error in main loop: {e}")
            await asyncio.sleep(5)  # 再接続までの待機時間

main_loop = asyncio.new_event_loop()
asyncio.set_event_loop(main_loop)
main_loop.run_until_complete(start())