import React, { FC, useCallback, useState } from 'react';
import { Grid, IconButton, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CachedIcon from '@mui/icons-material/Cached';
import { Dashboard } from 'components/Dashboard';
import { ScoreBlockContainer } from 'components/ScoreBlockContainer';
import { TimerDisplayContainer } from 'components/TimerDisplayContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

export const HomePage: FC = () => {
  const classes = useStyles();
  const [isReverse, setIsReverse] = useState(false);
  const onReverseClick = useCallback(() => { setIsReverse(!isReverse) }, [isReverse]);

  return (
    <Dashboard title="Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper className={classes.root}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              試合状況
            </Typography>
            <Grid container spacing={6}>
              {/* スコア */}
              <Grid item container justifyContent="space-between" alignItems="center" direction={isReverse ? "row-reverse" : "row"}>
                <Grid item xs={5}>
                  <ScoreBlockContainer fieldSide="blue" />
                </Grid>
                <Grid item xs={1}>
                  <IconButton aria-label="delete" color="default" onClick={onReverseClick} size="large">
                    <CachedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={5}>
                  <ScoreBlockContainer fieldSide="red" />
                </Grid>
              </Grid>
              {/* タイム */}
              <TimerDisplayContainer descriptionVariant="h4" displayTimeVariant="h1" />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper className={classes.root}>
            {"// このへんに何かいい感じの情報表示"}
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
