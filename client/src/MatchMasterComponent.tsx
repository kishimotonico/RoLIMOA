import React, { FC } from 'react';
import { Paper, Typography, Grid, Button, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

interface MatchMasterComponentProps {
  teamOptions: string[],
  onStartButton: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onChangeBlueTeamName: (event: React.ChangeEvent<{}>, value: string) => void,
  onChangeRedTeamName: (event: React.ChangeEvent<{}>, value: string) => void,
  isEnabledStartButton: boolean,
}

export const MatchMasterComponent: FC<MatchMasterComponentProps> = ({
  teamOptions,
  onChangeBlueTeamName,
  onChangeRedTeamName,
  onStartButton,
  isEnabledStartButton,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        試合マスタ
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            disableClearable
            options={teamOptions}
            onChange={onChangeBlueTeamName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="青チーム名"
                margin="normal"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />
          <Autocomplete
            freeSolo
            disableClearable
            options={teamOptions}
            onChange={onChangeRedTeamName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="赤チーム名"
                margin="normal"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onStartButton}
            disabled={!isEnabledStartButton}
          >
            試合開始
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
