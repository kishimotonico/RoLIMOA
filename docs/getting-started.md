# RoLIMOA 運用ガイド

このドキュメントでは、実際の大会でRoLIMOAを使う流れや準備方法、設定の記述方法を説明します。

## 最初の準備

まずはデフォルトの状態でRoLIMOAが動作することを確認してください。次のようにリポジトリをクローンして、ビルドします。

```bash
# リポジトリをクローン
git clone https://github.com/kishimotonico/RoLIMOA.git
cd RoLIMOA

# 依存関係をインストール
npm install

# 本番用にビルド
npm run build

# サーバーを起動
npm start
```

サーバーが起動すると `http://localhost:8000` でアクセスできるようになります。詳細はREADME.mdも参照してください。

## 競技ルールの設定

実際の大会でRoLIMOAを利用するためには、ルールに合わせた設定に変更する必要があります。
競技ルールなどを `packages/common/src/config/config.ts` で設定します。

### 1. 大会情報

```typescript
contest_info: {
  name: 'サンプルロボコン2025',  // 大会名
}
```

### 2. ルール - タスクオブジェクトの定義

RoLIMOAでは "タスクオブジェクト" というKey-Value形式のオブジェクトを管理することで、得点を管理しています。
得点を計算するための変数と考えてください。得点入力画面では、このタスクオブジェクトの数値を増減するUIを提供します。

```typescript
task_objects: [
  {
    id: 'Utsunomiya',        // 内部ID
    description: '宇都宮',    // 画面表示名
    initialValue: 0,         // 初期値
    min: 0,                  // 最小値（省略可）
    max: 1,                  // 最大値（省略可）
  },
  // ... 他の得点要素
]
```

### 3. 得点計算ルール

タスクオブジェクトから得点を計算するルールを定義します。

最も簡単な `format: 'simple'` で得点計算を定義するのがおすすめです。タスクオブジェクト(`id`)と、それに対応する得点(`coefficient`)を設定します。

```typescript
score: {
  format: 'simple',
  expression: [
    {
      id: 'Utsunomiya',       // タスクオブジェクトのID
      coefficient: 10,        // 点数（宇都宮×10点）
    },
    // ... 他の要素
  ],
}
```

### 4. Vゴール条件

Vゴールの名称を変更します。`type: 'alwaysOk'` で常にVゴール可能な設定にしておくのがおすすめです。

```typescript
vgoal: {
  name: 'Vゴール',           // Vゴール名
  condition: {
    type: 'alwaysOk',        // 常に可能
  },
}
```

Vゴールが不要な場合、 `type: 'disabled'` で常にVゴール不可能な設定にできます。

```typescript
vgoal: {
  name: 'Vゴール',           // Vゴール名
  condition: {
    type: 'disabled',        // 無効化
  },
}
```

### 5. 操作パネルの設定

得点入力画面のUIは、設定が不要な `type: 'default'` を使うのが簡単でおすすめです。
各タスクオブジェクトに対して「-1 / +1」のボタンが表示できます。

```typescript
control_panel: {
  type: 'default',
}
```

ボタンの詳細な配置や機能を指定したい場合や、チェックボックスなどのUIを使いたい場合、`type: 'custom'` を指定して詳細を設定できます。

```typescript
control_panel: {
  type: 'custom',
  panels: [
    {
      id: 'Utsunomiya',      // タスクオブジェクトのIDと対応
      type: 'multi_button',
      option: {
        buttons: [
          {
            command: '=0',    // 0にセットする
            label: '0',       // ボタン表示名
            style: {
              variant: 'outlined',  // ボタンスタイル
            },
          },
          {
            command: '+1',    // +1点
            label: '+1',
            shortcutKey: 'Q', // キーボードショートカット
          },
        ],
      },
    },
    // ... 他のパネル
  ],
}
```

### 6. タイマー設定

RoLIMOAではセッティングタイムやカウントダウン、競技中などの状況を "フェーズ" として定義しています。
`id: 'match'` のフェーズの `duration: 180` が競技時間の秒数設定です。


```typescript
time_progress: [
  //
  // ... 中略 ...
  //
  {
    id: 'match',
    type: 'count',
    duration: 180,
    description: '競技中',
    style: {
      timerFormat: 'm:ss',
      timerType: 'countup',
    },
    custom: [
      {
        elapsedTime: 0,
        displayText: 'GO',
        sound: 'tone_880hz_1000ms.mp3',
      },
      // ... 効果音再生など他の設定
    ],
  },
  {
    id: 'match_finish',
    type: 'ready',
    description: '試合終了',
    custom: [
      {
        elapsedTime: 0,
        displayText: '--   --',
      },
    ],
  },
],
```

### 7. チーム名の事前設定

大会前にチーム情報を登録しておくと、試合開始時に自動で反映されます。

```typescript
teams_info: [
  {
    id: '1',
    name: 'チーム名',
    school: '学校名',
    short: 'チーム名（学校名）',  // 短縮表示用
  },
  // ... 他のチーム
]
```

## 実装が必要なカスタマイズ

設定ファイルのみでのカスタマイズが難しい場合、本体のソースコードを変更することがあります。特に、次の場面で利用します。

- 会場スクリーンや配信オーバーレイの表示画面をカスタマイズしたいとき
- 点数計算やVゴール条件のロジックが複雑な場合
- 得点入力画面のUIを詳細にカスタマイズしたいとき

※ カスタマイズに関する仕様は頻繁に変わるため、最新の仕様は実際の実装を確認してください。

### 点数計算のカスタマイズ

複雑な点数計算ルールが必要な場合、TypeScriptで実装することも可能です。
まず、設定ファイルは `type: 'implement'` を指定します

```typescript
score: {
  format: 'implement',  // TypeScriptの実装を使用
}
```

**packages/client/src/custom/rule.score.ts** のscore関数を編集して、得点計算ロジックを実装します。

```typescript
import type { CurrentMatchStateType } from '~/util/currentMatchStateType';

type ScoreOutputType =
  | {
      value: number;
      refs?: Record<string, number>;  // 画面表示用の詳細情報（省略可）
    }
  | number;

export function score(stat: CurrentMatchStateType): ScoreOutputType {
  // 複雑な得点計算ロジックをここに実装
  // stat.taskObjects でタスクオブジェクトの値にアクセス可能
  
  const baseScore = stat.taskObjects["basic_point"] * 10;
  const bonusScore = stat.taskObjects["bonus_point"] ** 2; // ボーナス点は2乗
  
  return {
    value: baseScore + bonusScore,
    refs: {
      "基本点": baseScore,
      "ボーナス": bonusScore,
    }
  };
}
```

score関数は、得点を数値で返すか、valueとrefsを含むオブジェクトを返します。valueは得点の数値で、refsは参考として使うことができるKey-Value型の数値です。点数計算のルールが複雑な場合、スクリーン画面や配信オーバーレイ画面をカスタマイズしてrefsの値を表示することができます。

### 配信オーバーレイ画面のカスタマイズ

配信画面に表示する得点を大会に合わせてカスタマイズするには、Reactのコンポーネントを実装する必要があります。

まずは **packages/client/src/pages/StreamingOverlayPage.tsx** を確認してください。配信オーバーレイ画面は、主に `MainHud` コンポーネントで構成されています。

```tsx
// StreamingOverlayPage.tsx (簡略化)
import { MainHud } from '~/components/StreamingOverlay/simple';

export const StreamingOverlayPage = () => {
  return (
    <Box>
      <MainHud showScoreBoard={showScoreBoard} params={params} />
      <Box>
        <Box>
          {/* <SubHudDisplay /> */}
        </Box>
      </Box>
    </Box>
  );
};
```

`~/components/StreamingOverlay/simple/index.tsx` などを参考にして、次のサンプルコードのような `~/components/StreamingOverlay/custom/index.tsx` を新規作成します。

```tsx
// importは省略

export const MainHud = ({
  showScoreBoard,
  params,
}: {
  showScoreBoard: boolean;
  params: { reverse: boolean };
}) => {
  const { displayTime } = useDisplayTimer();

  return (
    <Box>
      <ScoreBlock fieldSide={params.reverse ? 'blue' : 'red'} />
      <Box>{displayTime}</Box>
      <ScoreBlock fieldSide={params.reverse ? 'red' : 'blue'} />
    </Box>
  );
};

const ScoreBlock = (props: { fieldSide: 'red' | 'blue' }) => {
  const name = useSelector<RootState, string | undefined>((state) => state.match.teams[props.fieldSide]?.shortName);
  const { value } = useDisplayScore(props.fieldSide);
  const { taskObjects } = useCurrentMatchState(props.fieldSide);

  return (
    <Box>
      <span>- チーム名: {name}</span>
      <span>- 点数: {value}</span>
      {Object.entries(taskObjects).map(([key, value]) => (
        <span key={key}>    - {key}: {value}</span>
      ))}
    </Box>
  );
};
```

そして、StreamingOverlayPage.tsxのimportを変更します。

```diff
// packages/client/src/pages/StreamingOverlayPage.tsx
- import { MainHud } from '~/components/StreamingOverlay/simple';
+ import { MainHud } from '~/components/StreamingOverlay/custom';
```

### スクリーン画面のカスタマイズ

スクリーン画面も同様に、Reactコンポーネントを実装してカスタマイズできます。 **packages/client/src/pages/ScreenPage.tsx** を編集してください。 

競技ルールに合わせた分かりやすい表示を加えたい場合は `ScreenPage` コンポーネントを直接変更するのでなく、**packages/client/src/components/Screen/Underlay.tsx** を編集して `Underlay` コンポーネントを実装するのがおすすめです。名前のとおり、既存の点数・タイマー表示の下に追加の情報を重ねて表示できます。


## 大会当日の運用フロー

### 運用に利用するデバイス

1台のPCだけでも運用できますが、RoLIMOAでは次のように複数のデバイスから操作するのを想定しています。

- **メインPC** (試合管理用PC): サーバーを起動するPCが必要です。サーバーと同じPCで試合管理（マスタ）画面を開くのを推奨します
- **得点入力用デバイス**: 青・赤コートの担当者が得点を操作するためのPCやスマホが必要です
- **スクリーン用PC**: 会場のプロジェクタにスクリーン画面を表示するPC。タイマーの時間ずれ防止のため、メインPCと兼用がおすすめです
- **配信用PC**: ライブ配信に使うPC。OBSのBrowser Sourceで配信オーバーレイ画面を表示します

また、これらのデバイスからRoLIMOAの画面を使うために、Wi-FiルーターなどでLAN環境を用意してください。

### 試合当日の操作手順

#### ステップ1: 準備

1. メインPCでサーバーを起動します
    ```bash
    npm start
    ```
2. メインPCで `http://localhost:8000` にアクセス
3. 他のデバイスでも同じLANに接続し、各デバイスで `http://[メインPCのIPアドレス]:8000` にアクセスします

#### ステップ2: 各デバイスで、各画面を開く

- **試合管理（マスタ）画面**: メインPCでの試合進行管理用
- **スクリーン画面**: 会場のメインスクリーン用（効果音も再生される）
- **青/赤チーム入力画面**: 各コートの担当者用
- **主審入力画面**: 試合全体の確認・結果確定用
- **配信オーバーレイ画面**: OBSのBrowser Source用（1600x900推奨）

**⚠️ 重要**: 試合管理画面は**1つのタブのみ**で開いてください。仕様上、複数のタブやデバイスで開くとフェーズ遷移が正常に機能しません。

#### ステップ3: 試合管理画面での試合進行操作

1. 青・赤のチーム名を選択、もしくは入力して〔試合開始〕ボタンを押す
1. 〔次のフェーズへ〕でセッティングタイム（デフォルトでは1分）を開始
1. 再度〔次のフェーズへ〕を押すと、カウントダウンが始まり、競技中フェーズに移行する
1. 各担当者が得点入力画面で得点を入力
1. 試合終了後、主審画面で〔試合結果を確定〕

## よくある問題と対処法

### 効果音が再生されない

**症状**: スクリーン画面で効果音やカウントダウン音が再生されない

**原因**: ブラウザの自動再生ポリシーによる制限

**対処法**:
1. **画面をクリック**:
  - ユーザーがクリックなどの操作をしないと、音声が自動再生されないケースがある
  - スクリーン画面上の適当な箇所をクリックする
2. **ブラウザを変更**: 
  - Chromeを使っている場合、Firefoxなどの別ブラウザを試す
3. **ブラウザ設定を確認**: 
  - サイト設定で音声の自動再生を「許可」に変更
  - アドレスバー左の🔒アイコン → サイトの設定 → 音声
4. **コンソールでエラー確認**: 
  - F12でデベロッパーツールを開き、Consoleタブでエラーなどを確認

### デバイスごとにタイマーがずれている

**症状**: タイマーの時間がデバイス間で数秒ずれている

**原因**: 各デバイスの日時設定がずれている

**対処法**:
1. **デバイスの日時を同期**:
  - PCやスマホをなるべく正確な日時に更新する
  - もしくは、メインPCにNTPサーバーを設定して他のデバイスと時刻を合わせる
2. **時刻オフセットを設定**:
  - 各デバイスで、画面右上の歯車アイコンから設定画面を開く
  - メインPCを基準に、他のデバイスで時刻のずれがなくなるようにオフセットを調整する

### 他のデバイスからアクセスできない

**症状**: メインPC以外のデバイスで `http://[IPアドレス]:8000` にアクセスできない

**原因**: サーバーのバインディング設定、ファイアウォール、またはネットワーク設定の問題

**対処法**:
1. **IPアドレスを確認**: 
  - Windows: `ipconfig` コマンド
  - Mac/Linux: `ifconfig` または `ip addr` コマンド
2. **ファイアウォール設定**:
  - Windowsファイアウォールでポート8000番を許可
  - セキュリティソフトの設定を確認
3. **同じネットワークにいるか確認**:
  - 同じWiFiに接続しているか
  - `ping [IPアドレス]` で疎通確認
