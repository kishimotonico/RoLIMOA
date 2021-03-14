import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState, ScoreStateType } from './store';
import { ScoreBlockComponent } from './ScoreBlockComponent';
import config from './config.json';

function calcScore(rule: { coefficient: number; id: string; }[], scoreStete: ScoreStateType): string {
  if (! scoreStete.enable) {
    return "---"; // スコア無効時
  }
  const scoreValue = rule.map(({coefficient, id}) => {
    const val = scoreStete.tasks[id];
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
