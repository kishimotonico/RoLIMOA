import { FC } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ScoreBlockContainer } from './ScoreBlockContainer';
import { TimerDisplayContainer } from './TimerDisplayContainer';
import { usePlayBeepIfNeeded } from './usePlayBeepIfNeeded';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2em',
  },
  header: {
    display: 'flex',
    width: '100%',
    height: '260px',
  },
}));


export const ScreenPage: FC = () => {
  const classes = useStyles();

  usePlayBeepIfNeeded();

  return (
    <div className={classes.root}>
      <Grid container spacing={6}>
        {/* スコア */}
        <Grid item container justify="space-between" alignItems="center">
          <Grid item xs={5}>
            <ScoreBlockContainer fieldSide="blue" />
          </Grid>
          <Grid item xs={2}>
            {/* <IconButton aria-label="delete" color="default" onClick={onReverseClick}>
              <CachedIcon />
            </IconButton> */}
          </Grid>
          <Grid item xs={5}>
            <ScoreBlockContainer fieldSide="red" />
          </Grid>
        </Grid>
        {/* タイム */}
        <TimerDisplayContainer descriptionVariant="h1" displayTimeVariant="h1" />
      </Grid>
    </div>
  );
}
