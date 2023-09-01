import { CurrentMatchStateType as VgoalConditionInputType } from '@/util/currentMatchStateType';

export function condition(stat: VgoalConditionInputType): boolean | undefined {
  // ここにVゴール可能の条件をかく
  //
  // config.json の rule.vgoal.condition に `"format": "implement"` の指定が
  // ある場合のみこの実装が有効

  //
  // とうロボ2023ルール
  // https://tourobo.net/2023/downloads/tourobo2023_rule_0827.pdf
  //
  const ownObjOnSharedSpot2 = stat.taskObjects["shared_spot_2_2ten"] + stat.taskObjects["shared_spot_2_3ten"];
  const opponentObjOnSharedSpot2 = stat.opponentTaskObjects["shared_spot_2_2ten"] + stat.opponentTaskObjects["shared_spot_2_3ten"];
  // すべての共有スポットおよび自陣スポットに自チームの建材が置かれているとき
  const placedOnAllSpots = stat.taskObjects["own_side_A"] > 0
          && stat.taskObjects["own_side_B"] > 0
          && stat.taskObjects["shared_spot_1_A"] > 0
          && stat.taskObjects["shared_spot_1_B"] > 0
          && ownObjOnSharedSpot2 > 0;
  // ① いずれかのスポットにおいて、建材の段数が相手チームの建材を含め10段を超えている
  const anyOver10 = stat.taskObjects["own_side_A"] > 10
          || stat.taskObjects["own_side_B"] > 10
          || stat.taskObjects["shared_spot_1_A"] + stat.opponentTaskObjects["shared_spot_1_A"] > 10
          || stat.taskObjects["shared_spot_1_B"] + stat.opponentTaskObjects["shared_spot_1_B"] > 10
          || ownObjOnSharedSpot2 + opponentObjOnSharedSpot2 > 10;
  // ② （すべての共有スポットの最上段が自チームの建材であり）得点可能なそれぞれのスポットが相手チーム含め3段以上積まれている
  const allOverOrEqual3 = stat.taskObjects["own_side_A"] >= 3
          && stat.taskObjects["own_side_B"] >= 3
          && stat.taskObjects["shared_spot_1_A"] + stat.opponentTaskObjects["shared_spot_1_A"] >= 3
          && stat.taskObjects["shared_spot_1_B"] + stat.opponentTaskObjects["shared_spot_1_B"] >= 3
          && ownObjOnSharedSpot2 + opponentObjOnSharedSpot2 >= 3;

  // ⚠️「最上段が自チームの建材」という部分は実装していない点に注意
  return placedOnAllSpots && (anyOver10 || allOverOrEqual3);
}
