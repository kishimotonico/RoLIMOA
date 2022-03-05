import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './features';
import { PhaseState } from './features/phase';
import { FieldSideType, scoreStateSlice, TaskStateType } from './features/score';
import { calculateScore, ScoreRuleType } from './models/calculateScore';
import { useRecoilValue } from 'recoil';
import { timerClockState } from './atoms/timerClockState';
import config from './config.json';

const scoreRule = config.rule.score as ScoreRuleType;

export function useDisplayScore(fieldSide: FieldSideType): string {
  const dispatch = useDispatch();
  const isScoreEnabled = useSelector<RootState, boolean>((state) => state.score[fieldSide].enable);
  const isScoreVgoaled = useSelector<RootState, number | undefined>((state) => state.score[fieldSide].vgoal);
  const taskObject = useSelector<RootState, TaskStateType>((state) => state.score[fieldSide].tasks);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const timerClock = useRecoilValue(timerClockState);

  // スコア無効時
  if (! isScoreEnabled) {
    return "---";
  }
  // Vゴール時
  if (isScoreVgoaled) {
    return config.rule.vgoal.name;
  }

  // 得点計算
  let elapsedSecond = timerClock ?? 0;
  if (phaseState.id !== "match") { // TODO: フェーズIDのハードコーディングをそのうち修正
    elapsedSecond = 0;
  }

  const { value, refs } = calculateScore(scoreRule, taskObject, elapsedSecond);
  const refValues = refs ?? {};
  dispatch(scoreStateSlice.actions.setRefValues({ fieldSide, refValues }));

  return value.toString();
}
