import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { ConnectedDevice } from 'slices/connectedDevices';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import makeStyles from '@mui/styles/makeStyles';
import { LyricalSocket } from 'lyricalSocket';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

export const DeviceListContainer: FC = () => {
  const connectedDevices = useSelector<RootState, ConnectedDevice[]>((state) => state.connectedDevices);
  const classes = useStyles();

  const onSaveClick = () => {
    LyricalSocket.instance.socket.emit("save_store");
  };

  return (
    <Paper className={classes.root}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        デバイス管理
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {connectedDevices.map((device) => (
              <TableRow key={device.sockId}>
                <TableCell scope="row">
                  {device.deviceName}
                </TableCell>
                <TableCell>
                  {device.currentPath ?? "-"}
                </TableCell>
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
