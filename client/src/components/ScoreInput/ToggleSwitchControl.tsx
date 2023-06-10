import { FC, useCallback } from 'react';
import { Switch, Box, Grid, Paper, Typography } from '@mui/material';
import { TaskObjectConfigType, TaskObjectToggleSwitchUiType } from 'config/types';

interface ToggleSwitchControlProps {
  color: "primary" | "secondary" | "default",
  config: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number) => void,
}

// しばらくは実際に使わなそうなので、試験的な実装
export const ToggleSwitchControl: FC<ToggleSwitchControlProps> = ({
  color,
  config,
  currentValue,
  stateUpdate,
}) => {
  const { description, ui } = config;
  const option = ui?.option as TaskObjectToggleSwitchUiType["option"]; // 仮機能なのでタイプガードなく適当に実装

  const checked = currentValue === option.on_value;
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    stateUpdate(event.target.checked ? option.on_value : option.off_value);
  }, [option, stateUpdate]);

  return (
    <Grid item xs={12} sm={6}>
      <Paper sx={{ p: '1em', userSelect: "none" }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {description}
        </Typography>

        <Box sx={{ pt: 0.5 }}>
          <Switch onChange={onChange} color={color} checked={checked}/>
        </Box>
      </Paper>
    </Grid>
  );
};
