import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { ScoreBlockV2Component } from './ScoreBlockV2Component';
import { useDisplayScore } from './useDisplayScore';

type ScoreBlockV2ContainerProps = {
  fieldSide: "blue"|"red";
  focused?: boolean;
};

export const ScoreBlockV2Container: FC<ScoreBlockV2ContainerProps> = ({
  fieldSide,
  ...props
}) => {
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide]);
  const displayScore = useDisplayScore(fieldSide);

  const color = {
    red: "red",
    blue: "blue",
  }[fieldSide];

  return <ScoreBlockV2Component score={displayScore} teamName={teamName} color={color} />;
};
 