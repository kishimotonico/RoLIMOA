import { useSelector } from 'react-redux';
import { RootState } from './features';
import { PhaseState } from './features/phase';
import { FieldSideType, ScoreStateType } from './features/score';
import { calculateScore, ScoreRuleType } from './models/calculateScore';
import { useRecoilValue } from 'recoil';
import { timerClockState } from './atoms/timerClockState';
import config from './config.json';

const scoreRule = config.rule.score as ScoreRuleType;

export function useDisplayScore(fieldSide: FieldSideType): string {
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const timerClock = useRecoilValue(timerClockState);

  // スコア無効時
  if (! scoreState.enable) {
    return "---";
  }
  // Vゴール時
  if (scoreState.vgoal) {
    return config.rule.vgoal.name;
  }

  // 得点計算
  const taskObject = scoreState.tasks;
  let elapsedSecond = timerClock ?? 0;
  if (phaseState.id !== "match") { // TODO: フェーズIDのハードコーディングをそのうち修正
    elapsedSecond = 0;
  }

  const scoreValue = calculateScore(scoreRule, taskObject, elapsedSecond);
  return scoreValue.toString();
}

