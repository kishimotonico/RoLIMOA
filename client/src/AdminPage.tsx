import React, { FC, useCallback, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Alert, AlertProps } from "@material-ui/lab";
import { Dashboard } from './Dashboard';
import { TimerMasterContainer } from './TimerMasterContainer';
import { MatchMasterContainer } from './MatchMasterContainer';
import { DeviceListContainer } from './DeviceListContainer';

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

        <Grid item xs={12} lg={7}>
          <TimerMasterContainer />
        </Grid>
        <Grid item xs={12} lg={7}>
          <MatchMasterContainer />
        </Grid>
        <Grid item xs={12} lg={7}>
          <DeviceListContainer />
        </Grid>
      </Grid>
    </Dashboard>
  );
}
