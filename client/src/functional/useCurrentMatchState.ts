
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { FieldScoreStateType, FieldSideType, ScoreState } from "slices/score";
import { PhaseState } from "slices/phase";
import { CurrentMatchStateType } from "util/currentMatchStateType";
import * as Phase from "util/PhaseStateUtil";

// 点数計算に、適切な経過時間を取得する
function matchElapsedSec(scoreState: FieldScoreStateType, phaseState?: PhaseState): number {
  if (! phaseState) {
    return NaN;
  }
  // Vゴール時にはVゴールタイムを経過時間にする
  if (scoreState.vgoal) {
    return scoreState.vgoal;
  }
  // 競技終了後は競技時間を経過時間として扱う
  if (phaseState.current.id === "match_finish") {
    return Phase.getConfig("match").time;
  }
  // 競技開始前は0秒として扱う
  if (phaseState.current.id !== "match") { // TODO: ハードコーディング気味なので良いアイデアがあれば改善
    return 0;
  }
  // 競技中は、経過時間をそのまま
  return phaseState.elapsedSecond;
}

// 現在の全体的な試合状況を取得する
export function useCurrentMatchState(fieldSide: FieldSideType): CurrentMatchStateType {
  const scoreState = useSelector<RootState, ScoreState>((state) => state.score);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  return useMemo(() => ({
    fieldSide,
    globalObjects: scoreState.global,
    taskObjects: scoreState.fields[fieldSide].tasks,
    matchStats: {
      elapsedTime: matchElapsedSec(scoreState.fields[fieldSide], phaseState),
      isVgoaled: scoreState.fields[fieldSide].vgoal !== undefined ? 1 : 0,
      vgoalTime: scoreState.fields[fieldSide].vgoal ?? NaN,
    },
  }), [fieldSide, scoreState, phaseState]);
}
