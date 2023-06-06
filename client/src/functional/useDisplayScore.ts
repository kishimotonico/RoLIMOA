import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import { FieldSideType, TeamScoreStateType } from 'slices/score';
import { calculateScore, ScoreRuleType } from 'util/calculateScore';
import { config } from 'config/load';

const scoreRule = config.rule.score as ScoreRuleType;

type DisplayScoreType = {
  text: string,
  scoreState: TeamScoreStateType,
  value: number,
  refs?: Record<string, number>,
};

export function useDisplayScore(fieldSide: FieldSideType): DisplayScoreType {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const scoreState = useSelector<RootState, TeamScoreStateType>((state) => state.score[fieldSide]);

  return useMemo(() => {
    const { value, refs } = calculateScore(scoreRule, scoreState, phaseState);

    // スコア無効時
    if (! scoreState.enable) {
      const text = "---";
      return { text, value, scoreState, refs };
    }
  
    // Vゴール時
    if (scoreState.vgoal) {
      const text = config.rule.vgoal.name
      return { text, value, scoreState, refs };
    }

    // 通常時
    const text = value.toString()
    return { text, value, scoreState, refs };
  }, [scoreState, phaseState]);
}
