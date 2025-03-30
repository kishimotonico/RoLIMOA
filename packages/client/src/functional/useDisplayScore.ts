import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/slices';
import type { FieldSideType, FieldScoreStateType } from '@/slices/score';
import { calculateScore, type ScoreRuleType } from '@/util/calculateScore';
import { config } from '@/config/load';
import { useCurrentMatchState } from './useCurrentMatchState';

const scoreRule = config.rule.score as ScoreRuleType;

type DisplayScoreType = {
  text: string;
  scoreState: FieldScoreStateType;
  value: number;
  refs?: Record<string, number>;
};

export function useDisplayScore(fieldSide: FieldSideType): DisplayScoreType {
  const currentMatchState = useCurrentMatchState(fieldSide);
  const scoreState = useSelector<RootState, FieldScoreStateType>(
    (state) => state.score.fields[fieldSide],
  );

  return useMemo(() => {
    const { value, refs } = calculateScore(scoreRule, currentMatchState);

    // スコア無効時
    if (!scoreState.enable) {
      const text = '---';
      return { text, value, scoreState, refs };
    }

    // Vゴール時
    if (scoreState.vgoal) {
      const text = config.rule.vgoal.name;
      return { text, value, scoreState, refs };
    }

    // 通常時
    const text = value.toString();
    return { text, value, scoreState, refs };
  }, [currentMatchState, scoreState]);
}
