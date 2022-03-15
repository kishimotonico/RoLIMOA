import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { useDisplayScore } from 'functional/useDisplayScore';
import { ScoreBlockComponent } from './ScoreBlockComponent';

interface ScoreBlockContainerProps {
  fieldSide: "blue"|"red";
  focused?: boolean;
  verticalPadding?: string;
}

export const ScoreBlockContainer: FC<ScoreBlockContainerProps> = ({
  fieldSide,
  ...props
}) => {
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide]);
  const displayScore = useDisplayScore(fieldSide);

  return <ScoreBlockComponent score={displayScore} teamName={teamName} fieldSide={fieldSide} {...props} />;
};
