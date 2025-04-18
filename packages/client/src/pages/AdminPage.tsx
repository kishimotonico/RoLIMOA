import { type FC, useCallback, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Alert } from '@mui/material';
import type { AlertProps } from '@mui/lab';
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
    <Grid2 size={12}>
      <Alert {...props} onClose={onClose} />
    </Grid2>
  ) : (
    <></>
  );
};

export const AdminPage: FC = () => {
  return (
    <Dashboard title="試合管理（マスタ）">
      <Grid2 container spacing={3}>
        <ClosableAlert severity="warning" sx={{ width: '100%' }}>
          このページで時刻の同期や試合の進行などを管理するので、管理者以外はこのページを開かないでください
        </ClosableAlert>

        <Grid2 size={{ xs: 12, lg: 7 }}>
          <TimerMasterContainer />
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 7 }}>
          <MatchMasterContainer />
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 7 }}>
          <DeviceListContainer />
        </Grid2>
      </Grid2>
    </Dashboard>
  );
};
