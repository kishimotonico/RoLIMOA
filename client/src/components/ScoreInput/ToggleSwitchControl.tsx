import { FC, useCallback } from 'react';
import { Switch, Box, Paper, Typography } from '@mui/material';
import { TaskObjectConfigType, TaskObjectToggleSwitchUiType } from '@/config/types';

interface ToggleSwitchControlProps {
  color: "primary" | "secondary" | "default",
  taskConfig: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number) => void,
  controlConfig: TaskObjectToggleSwitchUiType,
}

// しばらくは実際に使わなそうなので、試験的な実装
export const ToggleSwitchControl: FC<ToggleSwitchControlProps> = ({
  color,
  taskConfig,
  currentValue,
  stateUpdate,
  controlConfig,
}) => {
  const { description } = taskConfig;

  const checked = currentValue === controlConfig.option.on_value;
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    stateUpdate(event.target.checked ? controlConfig.option.on_value : controlConfig.option.off_value);
  }, [controlConfig.option, stateUpdate]);

  return (
    <Paper sx={{ p: '1em', userSelect: "none" }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>

      <Box sx={{ pt: 0.5 }}>
        <Switch onChange={onChange} color={color} checked={checked}/>
      </Box>
    </Paper>
  );
};
