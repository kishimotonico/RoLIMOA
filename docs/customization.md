# RoLIMOAのカスタマイズ方法

> [!NOTE]
> **運用ガイド**: 基本的な設定、カスタマイズについては [docs/getting-started.md](./getting-started.md) を参照してください

このドキュメントでは、TypeScriptやReactの実装が必要な高度なカスタマイズについて、実例と実装方法を紹介します。

## カスタマイズ例

### NHK学生ロボコン2023

**ルール概要**: 赤・青チームがフィールド上のポールにリングを投げる、輪投げのような競技

**カスタマイズ**: 配信画面に各ポールのリングの色を表示する機能を追加。得点入力画面をリングの色を選択するトグルボタンのUIに変更。

※ 実際の大会ではRoLIMOAを導入していません。デモのための再現です。

### 関東夏ロボコン2023

**ルール概要**: フィールド上の千葉、横浜、渋谷などのエリアにブロックを高く積み上げて点数を競う競技

**カスタマイズ**: 配信画面・スクリーン画面にブロックの積み上げ状況を視覚的に表示するグラフを追加


### 関東春ロボコン2024

**ルール概要**: 各チームの1台のロボットが、ひな人形を模したオブジェクトを運び、指定された配置に並べる競技

**カスタマイズ**: 配信画面・スクリーン画面でひな人形の配置を視覚的に表示。得点入力画面は設定ファイル（config.ts）のみでカスタマイズ


## 実装が必要なカスタマイズ

設定ファイルのみでのカスタマイズが難しい場合、ソースコードを直接編集します。以下のような場合に実装が必要です。

- 会場スクリーンや配信オーバーレイの表示画面をカスタマイズしたいとき
- 点数計算やVゴール条件のロジックが複雑な場合
- 得点入力画面のUIを詳細にカスタマイズしたいとき

※ カスタマイズに関する仕様は頻繁に変わるため、最新の仕様は実際の実装を確認してください。

### 点数計算のカスタマイズ

複雑な点数計算ルールが必要な場合、TypeScriptで実装することも可能です。
まず、設定ファイルで `format: 'implement'` を指定します。

```typescript
score: {
  format: 'implement',  // TypeScriptの実装を使用
}
```

次に、**packages/client/src/custom/rule.score.ts** のscore関数を編集して得点計算ロジックを実装します。

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
    // value: 得点の数値 (number型)
    value: baseScore + bonusScore,
    // refs: 得点計算の参考となる数値 (`{[key: string]: number }`)
    refs: {
      "基本点": baseScore,
      "ボーナス": bonusScore,
    }
  };
}
```

score関数は得点を数値で返すか、valueとrefsを含むオブジェクトを返します。

refsは、複雑な点数計算の途中式や内訳などをスクリーン画面や配信オーバーレイ画面で表示する際に便利です。

### 配信オーバーレイ画面のカスタマイズ

配信画面に表示する得点を大会に合わせてカスタマイズするには、Reactのコンポーネントを実装する必要があります。

まず **packages/client/src/pages/StreamingOverlayPage.tsx** を確認してください。配信オーバーレイ画面は主に `MainHud` コンポーネントで構成されています。

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

`~/components/StreamingOverlay/simple/index.tsx` を参考に、カスタムした `~/components/StreamingOverlay/custom/index.tsx` を作成します。

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

最後に、StreamingOverlayPage.tsxのimport文を変更します。

```diff
// packages/client/src/pages/StreamingOverlayPage.tsx
- import { MainHud } from '~/components/StreamingOverlay/simple';
+ import { MainHud } from '~/components/StreamingOverlay/custom';
```

### スクリーン画面のカスタマイズ

スクリーン画面も同様にReactコンポーネントを実装してカスタマイズできます。**packages/client/src/pages/ScreenPage.tsx** を編集します。 

競技ルールに合わせた表示を追加したい場合は、`ScreenPage` コンポーネントを直接変更するよりも **packages/client/src/components/Screen/Underlay.tsx** を編集することを推奨します。`Underlay` コンポーネントでは、既存の点数・タイマー表示の下に追加情報をオーバーレイ表示できます。

