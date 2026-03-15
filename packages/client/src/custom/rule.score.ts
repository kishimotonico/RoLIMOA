import type { CurrentMatchStateType } from '~/util/currentMatchStateType';

type ScoreOutputType =
  | {
      value: number;
      refs?: Record<string, number>;
    }
  | number;

/**
 * 関東春ロボコン2026「10周年の祝奏（ファンファーレ）」得点計算
 *
 * A: 「自動モード」で「ノーツエリア」に進入したことがある → 10点
 * B: 「ノーツ」が「スコア」に入っている → 1個につき5点（各色最大2個）
 * C: 「ノーツ」が「スコア」に2個以上入っている → 1箱につき20点
 */
export function score(stat: CurrentMatchStateType): ScoreOutputType {
  const enteredNotesArea = stat.taskObjects.entered_notes_area ?? 0;
  const redNotes = stat.taskObjects.red_notes ?? 0;
  const blueNotes = stat.taskObjects.blue_notes ?? 0;
  const yellowNotes = stat.taskObjects.yellow_notes ?? 0;

  // A: ノーツエリア進入ボーナス
  const scoreA = enteredNotesArea >= 1 ? 10 : 0;

  // B: ノーツ得点（1個5点、各色最大2個）
  const scoreB = (redNotes + blueNotes + yellowNotes) * 5;

  // C: スコアボーナス（2個以上入っている箱1つにつき20点）
  const redBonus = redNotes >= 2 ? 20 : 0;
  const blueBonus = blueNotes >= 2 ? 20 : 0;
  const yellowBonus = yellowNotes >= 2 ? 20 : 0;
  const scoreC = redBonus + blueBonus + yellowBonus;

  return {
    value: scoreA + scoreB + scoreC,
    refs: {
      'A. エリア進入': scoreA,
      'B. ノーツ': scoreB,
      'C. ボーナス': scoreC,
    },
  };
}
