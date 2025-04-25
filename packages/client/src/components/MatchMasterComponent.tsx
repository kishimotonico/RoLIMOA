import { Button, Grid2, Paper, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';

interface MatchMasterComponentProps {
  teamOptions: string[];
  onChangeMatchName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeBlueTeamName: (event: React.SyntheticEvent, value: string) => void;
  onChangeRedTeamName: (event: React.SyntheticEvent, value: string) => void;
  onStartButton: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isEnabledStartButton: boolean;
}

export const MatchMasterComponent = ({
  teamOptions,
  onChangeMatchName,
  onChangeBlueTeamName,
  onChangeRedTeamName,
  onStartButton,
  isEnabledStartButton,
}: MatchMasterComponentProps) => {
  return (
    <Paper sx={{ padding: '1em' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        試合マスタ
      </Typography>
      <Grid2 container spacing={1}>
        <Grid2 size={12}>
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
        </Grid2>
      </Grid2>
    </Paper>
  );
};
