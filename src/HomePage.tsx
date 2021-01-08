import React, { FC } from 'react';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Dashboard } from './Dashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));


export const HomePage: FC = () => {
  const classes = useStyles();

  return (
    <Dashboard title="Dashboard">
      <Grid container>
        <Paper className={classes.root}>
          <Typography component="h2" variant="h6" gutterBottom>
            ふぇぇ…
          </Typography>
          <Typography component="p">
            ロボコンの得点管理するよぉ
          </Typography>
        </Paper>
      </Grid>
    </Dashboard>
  );
}
