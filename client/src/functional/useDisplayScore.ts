import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import { FieldSideType, ScoreStateType } from 'slices/score';
import { calculateScore, ScoreRuleType } from 'util/calculateScore';
import config from 'config.json';

const scoreRule = config.rule.score as ScoreRuleType;

type DisplayScoreType = {
  text: string,
  scoreState: ScoreStateType,
  refs?: Record<string, number>,
};

export function useDisplayScore(fieldSide: FieldSideType): DisplayScoreType {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);

  return useMemo(() => {
    const { value, refs } = calculateScore(scoreRule, scoreState, phaseState);

    // スコア無効時
    if (! scoreState.enable) {
      const text = "---";
      return { text, scoreState, refs };
    }
  
    // Vゴール時
    if (scoreState.vgoal) {
      const text = config.rule.vgoal.name
      return { text, scoreState, refs };
    }

    // 通常時
    const text = value.toString()
    return { text, scoreState, refs };
  }, [scoreState, phaseState]);
}
