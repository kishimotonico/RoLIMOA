import { CurrentMatchStateType } from '@/util/currentMatchStateType';

type ScoreOutputType = {
  value: number,
  refs?: Record<string, number>,
} | number;

export function score(stat: CurrentMatchStateType): ScoreOutputType {
  // ここにスコアの計算処理をかく
  //
  // config.json の rule.score に `"format": "implement"` を指定した場合のみ、
  // この実装が有効
  //
  // 例えば下記のようなケースでは、TypeScriptでの得点計算を実装するのでなく、
  // config.json の rule.score に `"format": "simple"` を指定する方が簡単
  //
  // ```
  // return stat.taskObjects["A_1_point"] + stat.taskObjects["B_10_point"] * 10;
  // ```

  return NaN;
}
