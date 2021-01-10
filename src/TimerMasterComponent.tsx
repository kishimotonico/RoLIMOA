import React, { FC } from 'react';
import { Paper, Typography, Grid, Button, makeStyles, ButtonGroup } from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import { TimerDisplayContainer } from './TimerDisplayContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
  displayDescription: {
    minHeight: `${theme.typography.h6.lineHeight}em`,
  },
}));

interface TimerMasterComponentProps {
  onNextPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const TimerMasterComponent: FC<TimerMasterComponentProps> = ({
  onNextPhase,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        時刻マスタ
      </Typography>
      <TimerDisplayContainer descriptionVariant="h6" displayTimeVariant="h2" />
      <Grid container spacing={1}>
      <Grid item xs={8}>
      </Grid>
      <Grid item xs={5}>
        <ButtonGroup >
          <Button variant="contained" color="default" onClick={onNextPhase}>
            <ReplayIcon />
          </Button>
          <Button variant="contained" color="primary" onClick={onNextPhase}>
            次のフェーズへ
          </Button>
        </ButtonGroup>
      </Grid>
      </Grid>
    </Paper>
  );
}
