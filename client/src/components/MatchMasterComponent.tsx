import React, { FC } from 'react';
import { Paper, Typography, Grid, Button, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
}));

interface MatchMasterComponentProps {
  teamOptions: string[],
  onChangeMatchName: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onChangeBlueTeamName: (event: React.ChangeEvent<{}>, value: string) => void,
  onChangeRedTeamName: (event: React.ChangeEvent<{}>, value: string) => void,
  onStartButton: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  isEnabledStartButton: boolean,
}

export const MatchMasterComponent: FC<MatchMasterComponentProps> = ({
  teamOptions,
  onChangeMatchName,
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
          <TextField
            label="試合名"
            onChange={onChangeMatchName}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Autocomplete
            freeSolo
            disableClearable
            options={teamOptions}
            onInputChange={onChangeBlueTeamName}
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
            onInputChange={onChangeRedTeamName}
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
