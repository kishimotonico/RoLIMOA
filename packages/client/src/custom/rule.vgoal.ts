import type { CurrentMatchStateType as VgoalConditionInputType } from '@/util/currentMatchStateType';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function condition(_stat: VgoalConditionInputType): boolean | undefined {
  // ここにVゴール可能の条件をかく
  //
  // config.json の rule.vgoal.condition に `"format": "implement"` の指定が
  // ある場合のみこの実装が有効

  return true;
}
