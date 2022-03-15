import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../slices';
import { PhaseState } from '../slices/phase';
import { FieldSideType, scoreStateSlice, TaskStateType } from '../slices/score';
import { calculateScore, ScoreRuleType } from '../util/calculateScore';
import { useRecoilValue } from 'recoil';
import { timerClockState } from '../atoms/timerClockState';
import config from '../config.json';
import { useEffect } from 'react';

const scoreRule = config.rule.score as ScoreRuleType;

export function useDisplayScore(fieldSide: FieldSideType): string {
  const dispatch = useDispatch();
  const isScoreEnabled = useSelector<RootState, boolean>((state) => state.score[fieldSide].enable);
  const isScoreVgoaled = useSelector<RootState, number | undefined>((state) => state.score[fieldSide].vgoal);
  const taskObject = useSelector<RootState, TaskStateType>((state) => state.score[fieldSide].tasks);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const timerClock = useRecoilValue(timerClockState);

  // 得点計算
  let elapsedSecond = timerClock ?? 0;
  if (phaseState.id !== "match") { // TODO: フェーズIDのハードコーディングをそのうち修正
    elapsedSecond = 0;
  }

  const { value, refs } = calculateScore(scoreRule, taskObject, elapsedSecond);

  // refValuesを必要に応じて更新
  useEffect(() => {
    const refValues = refs ?? {};

    dispatch(scoreStateSlice.actions.setRefValues({ fieldSide, refValues }));
  }, [dispatch, fieldSide, refs]);

  // スコア無効時
  if (! isScoreEnabled) {
    return "---";
  }

  // Vゴール時
  if (isScoreVgoaled) {
    return config.rule.vgoal.name;
  }

  return value.toString();
}
