import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { ScoreBlockComponent } from './ScoreBlockComponent';
import config from './config.json';
import { ScoreStateType } from './features/score';

function calcScore(rule: { coefficient: number; id: string; }[], scoreState: ScoreStateType): string {
  // スコア無効時
  if (! scoreState.enable) {
    return "---";
  }
  // Vゴール時
  if (scoreState.vgoal) {
    return config.rule.vgoal.name;
  }

  const scoreValue = rule.map(({coefficient, id}) => {
    const val = scoreState.tasks[id];
    if (val === undefined) {
      return NaN; // error
    }
    return val * coefficient;
  }).reduce((acc, cur) => acc + cur, 0);
  return scoreValue.toString();
}

interface ScoreBlockContainerProps {
  fieldSide: "blue"|"red";
  focused?: boolean;
  verticalPadding?: string;
}

export const ScoreBlockContainer: FC<ScoreBlockContainerProps> = ({
  fieldSide,
  ...props
}) => {
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide]);
  const scoreValue = calcScore(config.rule.score, scoreState);

  return <ScoreBlockComponent score={scoreValue} teamName={teamName} fieldSide={fieldSide} {...props} />;
};
