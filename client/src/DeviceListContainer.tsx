import React, { FC } from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from './features';
import { ConnectedDevice } from './features/connectedDevices';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

export const DeviceListContainer: FC = () => {
  const connectedDevices = useSelector<RootState, ConnectedDevice[]>((state) => state.connectedDevices);
  const classes = useStyles();

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
                <TableCell scope="row">
                  {device.sockId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
