import React, { FC } from 'react';
import { Paper, Typography, Grid, Button, makeStyles, ButtonGroup } from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
  displayDescription: {
    minHeight: `${theme.typography.h6.lineHeight}em`,
  },
}));

interface TimerMasterComponentProps {
  displayTime: string;
  description: string;
  onNextPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const TimerMasterComponent: FC<TimerMasterComponentProps> = ({
  displayTime,
  description,
  onNextPhase,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        時刻マスタ
      </Typography>
      <Typography component="h2" variant="h6" align="center" color="textSecondary" className={classes.displayDescription}>
        {description}
      </Typography>
      <Typography component="h2" variant="h2" align="center">
        {displayTime}
      </Typography>
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
