import { CurrentMatchStateType } from '@/util/currentMatchStateType';

type ScoreOutputType = {
  value: number,
  refs?: Record<string, number>,
} | number;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function score(_stat: CurrentMatchStateType): ScoreOutputType {
  // ここにスコアの計算処理をかく
  //
  // config.json の rule.score に `"format": "implement"` を指定した場合のみ、
  // この実装が有効
  //
  // 例えば下記のようなケースでは、TypeScriptでの得点計算を実装するのでなく、
  // config.json の rule.score に `"format": "simple"` を指定する方が簡単
  //
  // ```
  // return _stat.taskObjects["A_1_point"] + _stat.taskObjects["B_10_point"] * 10;
  // ```

  const A = _stat.taskObjects["A"];
  const beehive_kuma = _stat.taskObjects["beehive_kuma"];
  const honney_kuma = _stat.taskObjects["honney_kuma"];
  const beehive_barrel = _stat.taskObjects["beehive_barrel"];
  const honney_barrel = _stat.taskObjects["honney_barrel"];

  const B = beehive_kuma + honney_kuma;
  const C = beehive_kuma > 0 && honney_kuma > 0 ? 1 : 0;
  const D = beehive_barrel + honney_barrel;
  const E = beehive_barrel > 0 && honney_barrel > 0 ? 1 : 0;

  return A * 1 + B * 40 + C * 60 + D * 100 + E * 200;
}
