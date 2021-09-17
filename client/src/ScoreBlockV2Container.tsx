import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { ScoreBlockV2Component } from './ScoreBlockV2Component';
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

type ScoreBlockV2ContainerProps = {
  fieldSide: "blue"|"red";
  focused?: boolean;
};

export const ScoreBlockV2Container: FC<ScoreBlockV2ContainerProps> = ({
  fieldSide,
  ...props
}) => {
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide]);
  const scoreValue = calcScore(config.rule.score, scoreState);

  const color = {
    red: "red",
    blue: "blue",
  }[fieldSide];

  return <ScoreBlockV2Component score={scoreValue} teamName={teamName} color={color} />;
};
