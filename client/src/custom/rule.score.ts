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

  const calcKaisuu = (location: string) => {
    const a = stat.taskObjects[`${location}_A`];
    const b = stat.taskObjects[`${location}_B`];
    const c = stat.taskObjects[`${location}_C`];

    return 4 * a + 2 * b + c;
  };

  const utsunomiya = stat.taskObjects["Utsunomiya"] > 0 ? 1 : 0; // 宇都宮は 0 or 1
  const chiba = calcKaisuu("Chiba");
  const saitama = calcKaisuu("Saitama");
  const yokohama = calcKaisuu("Yokohama");
  const shibuya = calcKaisuu("Shibuya");

  const refs = {
    "千葉": chiba,
    "さいたま": saitama,
    "横浜": yokohama,
    "渋谷": shibuya,
  };
  const value = 10 * utsunomiya + 10 * chiba + 11 * saitama + 14 * yokohama + 15 * shibuya;

  return { value, refs };
}
