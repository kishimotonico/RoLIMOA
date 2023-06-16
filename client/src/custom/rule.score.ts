import { CurrentMatchStateType } from 'util/currentMatchStateType';

type ScoreOutputType = {
  value: number,
  refs?: Record<string, number>,
} | number;

export function score(stat: CurrentMatchStateType): ScoreOutputType {
  // ここにスコアの計算処理をかく
  // return NaN;

  // NHK学ロボ2023のルールの設定
  // - P01, P02, P03側が赤コート。P09,P10,P11側が青コート
  // - 青リングの入ったポールは1、赤リングは2で示す
  if (stat.fieldSide === "red") {
    const type1
      = (stat.globalObjects["P01"] === 2 ? 1 : 0)
      + (stat.globalObjects["P02"] === 2 ? 1 : 0)
      + (stat.globalObjects["P03"] === 2 ? 1 : 0);
    const type2
      = (stat.globalObjects["P04"] === 2 ? 1 : 0)
      + (stat.globalObjects["P05"] === 2 ? 1 : 0)
      + (stat.globalObjects["P07"] === 2 ? 1 : 0)
      + (stat.globalObjects["P08"] === 2 ? 1 : 0);
    const type3
      = (stat.globalObjects["P06"] === 2 ? 1 : 0);
    const oppenentType1
      = (stat.globalObjects["P09"] === 2 ? 1 : 0)
      + (stat.globalObjects["P10"] === 2 ? 1 : 0)
      + (stat.globalObjects["P11"] === 2 ? 1 : 0);

    return type1 * 10 + type2 * 30 + type3 * 70 + oppenentType1 * 25;
  } 
  if (stat.fieldSide === "blue") {
    const type1
      = (stat.globalObjects["P09"] === 1 ? 1 : 0)
      + (stat.globalObjects["P10"] === 1 ? 1 : 0)
      + (stat.globalObjects["P11"] === 1 ? 1 : 0);
    const type2
      = (stat.globalObjects["P04"] === 1 ? 1 : 0)
      + (stat.globalObjects["P05"] === 1 ? 1 : 0)
      + (stat.globalObjects["P07"] === 1 ? 1 : 0)
      + (stat.globalObjects["P08"] === 1 ? 1 : 0);
    const type3
      = (stat.globalObjects["P06"] === 1 ? 1 : 0);
    const oppenentType1
      = (stat.globalObjects["P01"] === 1 ? 1 : 0)
      + (stat.globalObjects["P02"] === 1 ? 1 : 0)
      + (stat.globalObjects["P03"] === 1 ? 1 : 0);

    return type1 * 10 + type2 * 30 + type3 * 70 + oppenentType1 * 25;
  }
  return NaN;
}
