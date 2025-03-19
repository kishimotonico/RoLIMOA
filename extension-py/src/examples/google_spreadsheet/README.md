# RoLIMOA Googleスプレッドシート拡張

RoLIMOAの主審ページで「試合結果が確定」されたとき、試合結果をGoogleスプレッドシートに自動反映する拡張機能です。

サーバー本体のコードを直接変更することなく、WebSocketのクライアントとして起動します。

## 使い方

env.py.sampleを複製して、env.pyに対象のスプレッドシートURLやシート名を設定します。

```bash
$ cd /path/to/RoLIMOA/extension-py/
$ cp env.py.sample env.py
$ vi env.py
```

GoogleのAPIを設定し、認証に使用するJSONをcredential.jsonに保存します。
このサンプルコードではサービスアカウントを使った方法で実装しています。

```bash
$ cp /path/to/google-api-credential.json ./credential.json
```

[uv](https://github.com/astral-sh/uv) で依存関係をインストールして、起動します

```bash
$ uv sync --extra google_spreadsheet

$ uv run ./src/examples/google_spreadsheet/main.py
```

なお、接続先のRoLIMOAのサーバーのURLや、操作対象のスプレッドシートについて引数で指定も可能です。

```bash
$ uv run src/examples/google_spreadsheet/main.py -h
usage: main.py [-h] [--ws-url WS_URL] [--spreadsheet-url SPREADSHEET_URL] [--sheet-name SHEET_NAME]

options:
  -h, --help            show this help message and exit
  --ws-url WS_URL       RoLIMOAサーバーのWebSocket URL
  --spreadsheet-url SPREADSHEET_URL
                        操作対象のスプレッドシートのURL
  --sheet-name SHEET_NAME
                        操作対象のスプレッドシートのシート名
```

## スプレッドシートの内容

このサンプルでは、A列, B列, C列, … がそれぞれ次の内容を想定しています。
各環境に応じて、適宜調整してください。

- 日時
- 試合名
- 赤チームID
- 赤チーム名
- 赤チーム学校名
- 赤コートタスクA
- 赤コートタスクB
- 赤コートタスクC
- 赤コートタスクD
- 赤コートタスクE
- 赤コートタスクF
- 赤コートタスクG
- 赤コートタスクH
- 赤コート点数有効フラグ
- 赤コート勝利フラグ
- 赤コート点数
- 赤コートVゴール時間
- 青チームID
- 青チーム名
- 青チーム学校名
- 青コートタスクA
- 青コートタスクB
- 青コートタスクC
- 青コートタスクD
- 青コートタスクE
- 青コートタスクF
- 青コートタスクG
- 青コートタスクH
- 青コート点数有効フラグ
- 青コート勝利フラグ
- 青コート点数
- 青コートVゴール時間
- コメント
