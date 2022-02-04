# ロボコン試合管理システム

NHK学生ロボコンのようなロボットコンテストの大会で、対戦チームの得点を入力し、それを会場のスクリーンやストリーミング配信に表示する統合的なシステムです。

### 使い方（本番環境）

サーバ側でクライアント側のビルド済みファイルをホスティングしているので、実際の大会時には次のような運用を想定している。

```bash
cd path/to/project

# クライアントをビルド
cd ./client
yarn build

# サーバを起動する
cd ../server
npm start
```

http://localhost:8000 で管理画面を開けるようになる。OS側でTCP/8000のポートを開放すれば、他のデバイスから操作できる。

### 開発方法

#### 始める

開発時には、サーバ側とクライアント側を別に起動して開発する。

##### サーバ側

次のコマンドでサーバを起動します。サーバサイドはLinux環境でないとエラーになるかもなので、Windowsの場合はWSLの使用を推奨します。

```bash
npm start
```

##### クライアント側

次のコマンドを実行してから http://localhost:3000 にアクセスします。コードを編集して保存すると、自動で再ビルドが走ります。クライアントの方はnpmでなくyarnであるに注意。

```bash
yarn start
```

#### 使用技術

このプロジェクトでは次の要素技術を用いているので、開発にはそれぞれの基礎知識が必要

- TypeScript
- React
- Redux (Redux Toolkit)
- WebSocket (socket.io)
- Express

#### TODO: 改善したい点など

##### サーバとクライアントのコードの共通化

サーバとクライアントの両方でRedux（Redux Toolkit）を用いているので`server/src/features/*.ts`と`client/src/features/*.ts`で同じコードを管理している。1つにまとめたい。

`config.json`も同じく、サーバとクライアントの両方に同一内容のファイルが存在する必要がある。