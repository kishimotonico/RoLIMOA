import { CurrentMatchStateType as VgoalConditionInputType } from 'util/currentMatchStateType';

export function condition(stat: VgoalConditionInputType): boolean | undefined {
  // ここにVゴール可能の条件をかく
  // return true;

  // NHK学ロボ2023のルールの設定
  // - P01, P02, P03側が赤コート。P09,P10,P11側が青コート
  // - 青リングの入ったポールは1、赤リングは2で示す
  if (stat.fieldSide === "red") {
    return (
      stat.globalObjects["P01"] === 2 &&
      stat.globalObjects["P02"] === 2 &&
      stat.globalObjects["P03"] === 2 &&
      stat.globalObjects["P04"] === 2 &&
      stat.globalObjects["P05"] === 2 &&
      stat.globalObjects["P06"] === 2 &&
      stat.globalObjects["P07"] === 2 &&
      stat.globalObjects["P08"] === 2
    );
  } 
  if (stat.fieldSide === "blue") {
    return (
      stat.globalObjects["P04"] === 1 &&
      stat.globalObjects["P05"] === 1 &&
      stat.globalObjects["P06"] === 1 &&
      stat.globalObjects["P07"] === 1 &&
      stat.globalObjects["P08"] === 1 &&
      stat.globalObjects["P09"] === 1 &&
      stat.globalObjects["P10"] === 1 &&
      stat.globalObjects["P11"] === 1
    );
  }
}
