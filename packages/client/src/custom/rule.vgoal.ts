import type { CurrentMatchStateType as VgoalConditionInputType } from '~/util/currentMatchStateType';

/**
 * ファンファーレ達成条件
 *
 * 3色ある「スコア」にそれぞれ2個以上ずつ同色の「ノーツ」を入れる
 */
export function condition(stat: VgoalConditionInputType): boolean | undefined {
  const redNotes = stat.taskObjects.red_notes ?? 0;
  const blueNotes = stat.taskObjects.blue_notes ?? 0;
  const yellowNotes = stat.taskObjects.yellow_notes ?? 0;

  return redNotes >= 2 && blueNotes >= 2 && yellowNotes >= 2;
}
