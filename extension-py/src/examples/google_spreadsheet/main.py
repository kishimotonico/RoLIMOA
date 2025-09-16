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
        values = [
            datetime.now().strftime("%Y/%m/%d %H:%M:%S"),
            optional(payload, "match.name"),
            optional(payload, "match.teams.red.id"),
            optional(payload, "match.teams.red.name"),
            optional(payload, "match.teams.red.school"),
            optional(payload, "finalScore.fields.red.tasks.A_robot_moved"),
            optional(payload, "finalScore.fields.red.tasks.B_beetle_touched"),
            optional(payload, "finalScore.fields.red.tasks.C_beetle_display"),
            optional(payload, "finalScore.fields.red.tasks.D_stag_museum"),
            optional(payload, "finalScore.fields.red.tasks.E_stag_display"),
            #optional(payload, "finalScore.fields.red.tasks.violation"),
            #"",
            #"",
            optional(payload, "finalScore.fields.red.enable"),
            optional(payload, "finalScore.fields.red.winner"),
            optional(payload, "confirmedScore.red"),
            optional(payload, "finalScore.fields.red.vgoal"),
            optional(payload, "match.teams.blue.id"),
            optional(payload, "match.teams.blue.name"),
            optional(payload, "match.teams.blue.school"),
            optional(payload, "finalScore.fields.blue.tasks.A_robot_moved"),
            optional(payload, "finalScore.fields.blue.tasks.B_beetle_touched"),
            optional(payload, "finalScore.fields.blue.tasks.C_beetle_display"),
            optional(payload, "finalScore.fields.blue.tasks.D_stag_museum"),
            optional(payload, "finalScore.fields.blue.tasks.E_stag_display"),
            #optional(payload, "finalScore.fields.blue.tasks.violation"),
            #"",
            #"",
            optional(payload, "finalScore.fields.blue.enable"),
            optional(payload, "finalScore.fields.blue.winner"),
            optional(payload, "confirmedScore.blue"),
            optional(payload, "finalScore.fields.blue.vgoal"),
            optional(payload, "comment"),
        ]
        worksheet.append_row(
            values,
            value_input_option="USER_ENTERED", # type: ignore
            table_range ="A1:AG100",
        )
    except Exception as e:
        print(f"試合結果の書き込みに失敗しました: {e}")

asyncio.run(roliex.connect())
