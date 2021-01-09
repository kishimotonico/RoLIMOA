import React, { FC } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { ScoreBlock } from './ScoreDisplayBlock';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

interface ScoreBoardComponentProps {
  blueScore: number;
  redScore: number;
  focusedFieldSide?: "blue"|"red"|undefined;
}

export const ScoreBoardComponent: FC<ScoreBoardComponentProps> = ({
  blueScore,
  redScore,
  focusedFieldSide = undefined,
}) => {
  const classes = useStyles();

  const [blueFocused, redFocused] = (focusedFieldSide === "blue") ? [true, false]
                                  : (focusedFieldSide === "red")  ? [false, true]
                                  : [undefined, undefined];

  return (
    <Paper className={classes.root}>
      <ScoreBlock score={blueScore} fieldSide="blue" focused={blueFocused} />
      <ScoreBlock score={redScore} fieldSide="red" focused={redFocused} />
    </Paper>
  );
};
