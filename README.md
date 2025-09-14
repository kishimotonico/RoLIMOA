# RoLIMOA: **Ro**bocon **L**ivestreaming **I**ntegrated **M**atch **O**perating **A**pp

NHK学生ロボコンのようなロボットコンテストの大会で、青・赤チームの得点を各担当が入力し、それを会場のスクリーンやライブストリーミング（動画配信）に表示する統合的なシステムです。

[![demo](./docs/images/demo-video.gif)](https://www.youtube.com/watch?v=NV2unpMqg-M)

## 機能 / features

![RoLIMOAの想定構成図](./docs/images/RoLIMOAの想定構成図.drawio.png)

- NHK学生ロボコン・高専ロボコンと同じ、青コートと赤コートによる2チームの対戦形式
- 毎年変わるルールに合わせ、JSONで得点計算やVゴール名などを柔軟に設定
- スクリーンや配信画面に、対戦チーム名や得点、タイマーを表示
- 各デバイスでの操作した得点は、他のデバイスとリアルタイムに同期


## 使い方 / Usage

> [!NOTE]
> 📖 **運用ガイド**: 実際の大会での使用方法、設定ファイルの編集、トラブルシューティングについて、詳しくは [docs/getting-started.md](./docs/getting-started.md) を参照してください

### 設定ファイルの編集

競技ルールの設定は `packages/common/src/config/config.ts` で行います。特にルールに関する `rule.task_objects`, `rule.score`, `rule.vgoal` を編集します。

### 本番環境の起動

サーバ側でクライアントのビルド済みファイルをホスティングしているので、実際の大会時には次のような運用を想定しています。

```bash
# 事前にビルド
git clone https://github.com/kishimotonico/RoLIMOA.git
cd RoLIMOA
npm install
npm run build

# サーバーを起動
npm start
```

http://localhost:8000 で管理画面を開けるようになります。OSやファイアウォールを設定すれば、他のデバイスからも操作できます。



## 開発方法 / How to develop

```bash
npm run dev
```

サーバーとクライアントを同時に起動します。

### アーキテクチャ

#### モノレポ構成
- `packages/common/`: 共通型定義、Redux設定、設定ファイルスキーマ
- `packages/client/`: React フロントエンド (Vite)
- `packages/server/`: Express サーバー (WebSocket通信)

#### 状態管理
- Redux Toolkit（共通）+ Recoil（クライアント固有）
- サーバー・クライアント間でReduxスライスを一部共有
- WebSocketでリアルタイム同期

#### 設定システム
- `packages/common/src/config/config.ts` で競技ルール設定
- Zodスキーマ（`packages/common/src/config/schema/`）で型検証
- 多様なルールに対応するための得点の管理
    - "タスクオブジェクト" という仮想的なオブジェクトを定義
    - 得点入力画面では、各タスクオブジェクトの増減を操作
    - 得点は、タスクオブジェクト (Key-Value形式) から算出

### 技術スタック
- TypeScript
- React + MUI
- Redux Toolkit
- Recoil
- WebSocket
- Express + express-ws
- Vite (build)
- Biome (lint/format)

### リント・フォーマット

```bash
npm run lint     # 全ワークスペースでBiome lintを実行
npm run format   # 全ワークスペースでBiome formatを実行
```

### 🐋 Docker対応

本番環境:
```bash
docker build -t rolimoa .
docker run -p 8000:8000 rolimoa
```

開発環境:
```bash
docker compose up -d
```


## ライセンス / License

MIT License
