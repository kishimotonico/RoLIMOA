# RoLIMOA: **Ro**bocon **L**ivestreaming **I**ntegrated **M**atch **O**perating **A**pp

NHK学生ロボコンのようなロボットコンテストの大会で、青・赤チームの得点を各担当が入力し、それを会場のスクリーンやライブストリーミング（動画配信）に表示する統合的なシステムです。

[![demo](./docs/demo-video.gif)](https://www.youtube.com/watch?v=NV2unpMqg-M)

## 機能 / features

![RoLIMOAの想定構成図](./docs/RoLIMOAの想定構成図.drawio.png)

- NHK学生ロボコン・高専ロボコンと同じ、青コートと赤コートによる2チームの対戦形式
- 毎年変わるルールに合わせ、JSONで得点計算方法やVゴール名などを設定
- 各デバイスで入力した得点は他のデバイスと同期
- スクリーンや配信画面に、対戦チーム名や得点、タイマーを表示


## 使い方 / Usage

### 設定ファイルの編集

client/src/config.jsonを編集して、好みの設定にします。特にルールに関する`rule.task_objects`, `rule.score`, `rule.vgoal`を編集します。server/src/config.jsonも同じ内容で保存してください。

現在、config.jsonについてドキュメントなどはありません。client/src/config/schema.tsでzod schemaを定義しているので、それを参考にしてください。

### 本番環境の起動方法

サーバ側でクライアントのビルド済みファイルをホスティングしているので、実際の大会時には次のような運用を想定しています。

```bash
git clone https://github.com/kishimotonico/RoLIMOA.git
cd RoLIMOA

# クライアントをビルド
cd ./client
npm i       # 初回のみ
npm run build

# サーバを起動する
cd ../server
npm i       # 初回のみ
npm start
```

http://localhost:8000 で管理画面を開けるようになります。OS側でTCP:8000のポートを開放すれば、他のデバイスからも操作できます。

### 仕様 / Tips

現在、次の使い方・環境を想定しています。

- 「青/赤チーム入力」ページは、それぞれの担当者が各デバイスで使用
    - UIの最適化はしていないが、スマホでも操作できる
- 「スクリーン」ページは、1920x1080の画面にFirefoxで全画面化で表示
    - このページではconfig.jsonで設定された効果音が再生される
    - ブラウザで「音声の自動再生」を許可しておく必要がある
    - タイマーの挙動が不安定になったときは、ページのF5でリロードで直る
- 「試合管理」ページは、1つのタブでのみ開く
    - 特に自動でのフェーズ遷移（カウントダウン→スタートなど）がある場合に注意
- 「配信オーバーレイ」ページは、OBSのBrowser Sourceで使用
    - Browser SourceはOBS上で1600x900の大きさ
    - Browser Sourceでは音声を再生せず、配信には会場の音を取り込む


## 開発方法 / How to develop

開発時には、サーバとクライアントをそれぞれ起動して開発します。

```bash
# サーバ側
cd /path/to/RoLIMOA/server
npm start

# クライアント側
cd /path/to/RoLIMOA/client
npm run dev
```

### 要素技術

このプロジェクトでは次の言語やライブラリを使ってます

- TypeScript
- React
- Redux (Redux Toolkit)
- Recoil
- WebSocket (socket.io)
- Zod
- Express

### TODO: 今後追加したい機能や、改善したい点など

#### タイマー、時刻表示の改善

タイマーが二重に起動して表示が安定しないことや、意図しない音声再生するときがあるので改善したい。

#### 各試合のログ保存・再生

各試合でチームの点数状況などを保存したり、得点の増減など各操作を記録して再現したりする機能が欲しい。

#### サーバとクライアントのコードの共通化

サーバとクライアントの両方でRedux（Redux Toolkit）を用いているので`server/src/slices/*.ts`と`client/src/features/*.ts`でほぼ同じコードを管理している。1つにまとめたい。
