import React, { FC, useCallback, useState } from 'react';
import { Grid } from '@mui/material';
import { Alert } from '@mui/material';
import { AlertProps } from '@mui/lab';
import { Dashboard } from '@/components/Dashboard';
import { TimerMasterContainer } from '@/components/TimerMasterContainer';
import { MatchMasterContainer } from '@/components/MatchMasterContainer';
import { DeviceListContainer } from '@/components/DeviceListContainer';

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

export const AdminPage: FC = () => {
  return (
    <Dashboard title="試合管理（マスタ）">
      <Grid container spacing={3}>
        <ClosableAlert severity="warning" sx={{ width: '100%' }} >
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
