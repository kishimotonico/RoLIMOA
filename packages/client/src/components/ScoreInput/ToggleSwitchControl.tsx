import { Box, FormControlLabel, FormGroup, Paper, Switch, Typography } from '@mui/material';
import type { TaskObjectConfigType, TaskObjectToggleSwitchUiType } from '@rolimoa/common/config';
import { type FC, useCallback } from 'react';

interface ToggleSwitchControlProps {
  color: 'primary' | 'secondary' | 'default';
  taskConfig: TaskObjectConfigType;
  currentValue: number;
  stateUpdate: (value: number, cmd: string) => void;
  controlConfig: TaskObjectToggleSwitchUiType;
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
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        stateUpdate(controlConfig.option.on_value, 'on');
      } else {
        stateUpdate(controlConfig.option.off_value, 'off');
      }
    },
    [controlConfig.option, stateUpdate],
  );

  return (
    <Paper sx={{ p: '1em', userSelect: 'none' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>

      <Box sx={{ pt: 0.5 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={onChange} color={color} checked={checked} />}
            label={
              checked
                ? (controlConfig.option?.on_label ?? '')
                : (controlConfig.option?.off_label ?? '')
            }
          />
        </FormGroup>
      </Box>
    </Paper>
  );
};
