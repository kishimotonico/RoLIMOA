import React, { FC } from 'react';
import { Grid, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ScoreBlock } from './ScoreBlock';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

interface ScoreBoardProps {
  focusedFieldSide?: "blue"|"red"|undefined;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({
  focusedFieldSide = undefined,
}) => {
  const classes = useStyles();

  const [blueFocused, redFocused] = (focusedFieldSide === "blue") ? [true, false]
                                  : (focusedFieldSide === "red")  ? [false, true]
                                  : [undefined, undefined];

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ScoreBlock fieldSide="blue" focused={blueFocused} />
        </Grid>
        <Grid item xs={12}>
          <ScoreBlock fieldSide="red" focused={redFocused} />
        </Grid>
      </Grid>
    </Paper>
  );
};
