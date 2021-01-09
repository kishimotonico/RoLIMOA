import React, { FC, useCallback, useState } from 'react';
import { Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { Dashboard } from './Dashboard';
import { ScoreBlockContainer } from './ScoreBlockContainer';

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
              <Grid item container justify="space-between" alignItems="center" direction={isReverse ? "row-reverse" : "row"}>
                <Grid item xs={5}>
                  <ScoreBlockContainer fieldSide="blue" />
                </Grid>
                <Grid item xs={1}>
                  <IconButton aria-label="delete" color="default" onClick={onReverseClick}>
                    <CachedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={5}>
                  <ScoreBlockContainer fieldSide="red" />
                </Grid>
              </Grid>
              {/* タイム */}
              <Grid item container justify="center" spacing={1}>
                <Grid item xs={12}>
                  <Typography component="p" variant="h4" align="center" color="textSecondary">
                    セッティングタイム
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" variant="h1" align="center">
                    READY
                  </Typography>
                </Grid>
              </Grid>
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
