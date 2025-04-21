import { LyricalSocket } from '@/lyricalSocket';
import SaveIcon from '@mui/icons-material/Save';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import type { ConnectedDevice } from '@rolimoa/common/redux';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

export const DeviceListContainer: FC = () => {
  const connectedDevices = useSelector<RootState, ConnectedDevice[]>(
    (state) => state.connectedDevices,
  );

  const onSaveClick = () => {
    LyricalSocket.sendOperation('save_store');
  };

  return (
    <Paper sx={{ padding: '1em' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        デバイス管理
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {connectedDevices.map((device) => (
              <TableRow key={device.sockId}>
                <TableCell scope="row">{device.deviceName}</TableCell>
                <TableCell>{device.currentPath ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton onClick={onSaveClick}>
          <SaveIcon />
        </IconButton>
      </TableContainer>
    </Paper>
  );
};
