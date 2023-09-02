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

  //
  // とうロボ2023ルール
  // https://tourobo.net/2023/downloads/tourobo2023_rule_0827.pdf
  //
  // 自陣スポット: 建材1段につき1点を獲得できる。ただし、4段目以上は得点とならない。
  const ownSpotA = Math.min(3, stat.taskObjects["own_side_A"]) * 1;
  const ownSpotB = Math.min(3, stat.taskObjects["own_side_B"]) * 1;
  // 共有スポットⅠ: 建材1段につき2点を獲得できる。自チームが置いた箱の段数で得点を計測する。
  const sharedSpot1A = stat.taskObjects["shared_spot_1_A"] * 2;
  const sharedSpot1B = stat.taskObjects["shared_spot_1_B"] * 2;
  // 共有スポットⅡ: 建材1段につき2点を獲得できる。自チームが置いた箱の段数で得点を計測する。
  const sharedSpot2 = stat.taskObjects["shared_spot_2_2ten"] * 2 + stat.taskObjects["shared_spot_2_3ten"] * 3;
  
  return ownSpotA + ownSpotB + sharedSpot1A + sharedSpot1B + sharedSpot2;
}
