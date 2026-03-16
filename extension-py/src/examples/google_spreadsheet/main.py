from google.oauth2.service_account import Credentials
import gspread # `pip install google gspread`
from datetime import datetime
from pathlib import Path
import asyncio
import argparse
import env
from rolimoa_extension import RoLIMOAExtension

def optional(obj: dict, key: str, default=""):
    # Pythonにはoptional chainingがないので代わりに
    if "." in key:
        keys  = key.split(".")
        return optional(obj.get(keys[0], {}), ".".join(keys[1:]), default)

    return obj.get(key, default)

def calc_score(tasks: dict) -> tuple[int, int, int, int]:
    """
    春26ルールに基づきA,B,Cの得点と合計を計算する

    A: ノーツエリア進入 → 10点
    B: ノーツ1個につき5点（各色最大2個）
    C: 同色ノーツが2個以上 → 1箱につき20点
    """
    entered = int(tasks.get("entered_notes_area", 0) or 0)
    red = int(tasks.get("red_notes", 0) or 0)
    blue = int(tasks.get("blue_notes", 0) or 0)
    yellow = int(tasks.get("yellow_notes", 0) or 0)

    score_a = 10 if entered >= 1 else 0
    score_b = (red + blue + yellow) * 5
    score_c = (20 if red >= 2 else 0) + (20 if blue >= 2 else 0) + (20 if yellow >= 2 else 0)

    return score_a, score_b, score_c, score_a + score_b + score_c

# サービスアカウントを作成して、credential.jsonを作成します
#
# - https://gspread.readthedocs.io/en/latest/oauth2.html
# - https://zenn.dev/yamagishihrd/articles/2022-09_01-google-spreadsheet-with-python
CREDENTIAL_FILEPATH = Path(__file__).parent / 'credential.json'

# argparse
parser = argparse.ArgumentParser()
parser.add_argument("--ws-url", type=str, default="ws://localhost:8000/ws", help="RoLIMOAサーバーのWebSocket URL")
parser.add_argument("--spreadsheet-url", type=str, default=env.SPREADSHEET_URL, help="操作対象のスプレッドシートのURL")
parser.add_argument("--sheet-name", type=str, default=env.SPREADSHEET_SHEET_NAME, help="操作対象のスプレッドシートのシート名")

args = parser.parse_args()

RoLIMOA_SERVER = args.ws_url
SPREADSHEET_URL = args.spreadsheet_url
SPREADSHEET_SHEET_NAME = args.sheet_name

print(f"RoLIMOAサーバーに接続します")
print(f"- URL: {RoLIMOA_SERVER}")
print(f"")

credentials = Credentials.from_service_account_file(
    CREDENTIAL_FILEPATH,
    scopes=[
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
    ]
)
gc = gspread.auth.authorize(credentials)
spreadsheet = gc.open_by_url(SPREADSHEET_URL)
worksheet = spreadsheet.worksheet(SPREADSHEET_SHEET_NAME)

print(f"次のスプレッドシートに試合結果を記録します")
print(f"- URL: {spreadsheet.url}")
print(f"- タイトル: {spreadsheet.title}")
print(f"- シート名: {worksheet.title}")
print(f"- ヘッダー: {worksheet.get()[0]}")
print(f"")

roliex = RoLIMOAExtension(RoLIMOA_SERVER)

@roliex.on_dispatch("resultRecords/addResult")
def write_match_result(payload: dict):
    """
    スプレッドシートに試合結果を書き込む
    """
    print(f"スプレッドシートに試合結果を書き込みます")
    print(f"- 試合名: {payload['match']['name']}")
    print(f"- 点数: {payload['confirmedScore']['red']} vs {payload['confirmedScore']['blue']}")
    print(f"- コメント: {payload['comment']}")
    print(f"")
    try:
        red_tasks = optional(payload, "finalScore.fields.red.tasks", {})
        blue_tasks = optional(payload, "finalScore.fields.blue.tasks", {})
        red_a, red_b, red_c, red_total = calc_score(red_tasks)
        blue_a, blue_b, blue_c, blue_total = calc_score(blue_tasks)

        values = [
            # 記録日時
            datetime.now().strftime("%Y/%m/%d %H:%M:%S"),
            # 試合名
            optional(payload, "match.name"),
            # --- 赤チーム ---
            optional(payload, "match.teams.red.id"),
            optional(payload, "match.teams.red.name"),
            optional(payload, "match.teams.red.school"),
            # 自動計算スコア（赤）
            red_a,   # A. エリア進入 (10点)
            red_b,   # B. ノーツ (各5点)
            red_c,   # C. ボーナス (各20点)
            # 結果（赤）
            optional(payload, "finalScore.fields.red.enable"),
            optional(payload, "finalScore.fields.red.winner"),
            optional(payload, "confirmedScore.red"),
            optional(payload, "finalScore.fields.red.vgoal"),
            # --- 青チーム ---
            optional(payload, "match.teams.blue.id"),
            optional(payload, "match.teams.blue.name"),
            optional(payload, "match.teams.blue.school"),
            # 自動計算スコア（青）
            blue_a,   # A. エリア進入 (10点)
            blue_b,   # B. ノーツ (各5点)
            blue_c,   # C. ボーナス (各20点)
            # 結果（青）
            optional(payload, "finalScore.fields.blue.enable"),
            optional(payload, "finalScore.fields.blue.winner"),
            optional(payload, "confirmedScore.blue"),
            optional(payload, "finalScore.fields.blue.vgoal"),
            # コメント
            optional(payload, "comment"),
        ]
        worksheet.append_row(
            values,
            value_input_option="USER_ENTERED", # type: ignore
            table_range ="A1:AA100",
        )
    except Exception as e:
        print(f"試合結果の書き込みに失敗しました: {e}")

asyncio.run(roliex.connect())
