import React, { FC, useCallback, useState } from 'react';
import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Alert, AlertProps } from "@material-ui/lab";
import { Dashboard } from './Dashboard';

const ClosableAlert: FC<AlertProps> = (props) => {
  const [open, setOpen] = useState(true);
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return open ? (
    <Grid item xs={12}>
      <Alert {...props} onClose={onClose} />
    </Grid>
  ) : <></>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
  topAlert: {
    width: '100%',
  },
}));

export const AdminPage: FC = () => {
  const classes = useStyles();

  return (
    <Dashboard title="試合管理（マスタ）">
      <Grid container spacing={3}>
        <ClosableAlert severity="warning" className={classes.topAlert} >
          このページで時刻の同期や試合の進行などを管理するので、管理者以外はこのページを開かないでください
        </ClosableAlert>

        <Grid item xs={12} lg={6}>
          <Paper className={classes.root}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              時刻マスタ
            </Typography>
            <Typography component="h2" variant="h6" align="center">
              セッティングタイム
            </Typography>
            <Typography component="h2" variant="h3" align="center">
              READY
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary">
                  次のフェーズへ移行
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
