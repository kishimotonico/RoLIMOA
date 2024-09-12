from google.oauth2.service_account import Credentials
import gspread # `pip install google gspread`
from datetime import datetime
from pathlib import Path
import env
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))
from rolimoa_extension import RoLIMOAExtension

def optional(obj: dict, key: str, default=""):
    # Pythonにはoptional chainingがないので代わりに
    if "." in key:
        keys  = key.split(".")
        return optional(obj.get(keys[0], {}), ".".join(keys[1:]), default)

    return obj.get(key, default)

RoLIMOA_SERVER = "ws://localhost:8000/ws"

# サービスアカウントを作成して、credential.jsonを作成します
#
# - https://gspread.readthedocs.io/en/latest/oauth2.html
# - https://zenn.dev/yamagishihrd/articles/2022-09_01-google-spreadsheet-with-python
CREDENTIAL_FILEPATH = Path(__file__).parent / 'credential.json'

# env.py.exampleを参照
SPREADSHEET_URL = env.SPREADSHEET_URL
SPREADSHEET_SHEET_NAME = env.SPREADSHEET_SHEET_NAME

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
    print(f"- 赤vs青: {payload['match']['teams']['red']['name']} vs {payload['match']['teams']['blue']['name']}")
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
            optional(payload, "finalScore.fields.red.tasks.A"),
            optional(payload, "finalScore.fields.red.tasks.B"),
            optional(payload, "finalScore.fields.red.tasks.C"),
            optional(payload, "finalScore.fields.red.tasks.D"),
            optional(payload, "finalScore.fields.red.tasks.violation"),
            optional(payload, "finalScore.fields.red.enable"),
            optional(payload, "finalScore.fields.red.winner"),
            optional(payload, "confirmedScore.red"),
            optional(payload, "finalScore.fields.red.vgoal"),
            optional(payload, "match.teams.blue.id"),
            optional(payload, "match.teams.blue.name"),
            optional(payload, "match.teams.blue.school"),
            optional(payload, "finalScore.fields.blue.tasks.A"),
            optional(payload, "finalScore.fields.blue.tasks.B"),
            optional(payload, "finalScore.fields.blue.tasks.C"),
            optional(payload, "finalScore.fields.blue.tasks.D"),
            optional(payload, "finalScore.fields.blue.tasks.violation"),
            optional(payload, "finalScore.fields.blue.enable"),
            optional(payload, "finalScore.fields.blue.winner"),
            optional(payload, "confirmedScore.blue"),
            optional(payload, "finalScore.fields.blue.vgoal"),
            optional(payload, "comment"),
        ]
        worksheet.append_row(
            values,
            value_input_option="USER_ENTERED", # type: ignore
            table_range ="A1:AA100",
        )
    except Exception as e:
        print(f"試合結果の書き込みに失敗しました: {e}")

roliex.connect()
