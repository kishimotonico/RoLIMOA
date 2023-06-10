import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import { FieldSideType, FieldScoreStateType, ScoreState } from 'slices/score';
import { calculateScore, ScoreRuleType } from 'util/calculateScore';
import { config } from 'config/load';

const scoreRule = config.rule.score as ScoreRuleType;

type DisplayScoreType = {
  text: string,
  scoreState: FieldScoreStateType,
  value: number,
  refs?: Record<string, number>,
};

export function useDisplayScore(fieldSide: FieldSideType): DisplayScoreType {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const scoreState = useSelector<RootState, ScoreState>((state) => state.score);

  return useMemo(() => {
    const localScore = scoreState.fields[fieldSide];
    const { value, refs } = calculateScore(scoreRule, fieldSide, scoreState, phaseState);

    // スコア無効時
    if (! localScore.enable) {
      const text = "---";
      return { text, value, scoreState: localScore, refs };
    }

    // Vゴール時
    if (localScore.vgoal) {
      const text = config.rule.vgoal.name
      return { text, value, scoreState: localScore, refs };
    }

    // 通常時
    const text = value.toString()
    return { text, value, scoreState: localScore, refs };
  }, [scoreState, fieldSide, phaseState]);
}
