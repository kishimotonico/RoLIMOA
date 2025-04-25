import { Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { TaskObjectConfigType, TaskObjectToggleButtonUiType } from '@rolimoa/common/config';
import { useCallback } from 'react';

interface ToggleButtonControlProps {
  taskConfig: TaskObjectConfigType;
  currentValue: number;
  stateUpdate: (value: number, cmd: string) => void;
  controlConfig: TaskObjectToggleButtonUiType;
}

export const ToggleButtonControl = ({
  taskConfig,
  currentValue,
  stateUpdate,
  controlConfig,
}: ToggleButtonControlProps) => {
  const { description } = taskConfig;
  const option = controlConfig.option;

  const onChange = useCallback(
    (_: React.MouseEvent<HTMLElement, MouseEvent>, value: number) => {
      stateUpdate(value, `=${value}`);
    },
    [stateUpdate],
  );

  return (
    <Paper sx={{ p: '1em', userSelect: 'none' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>

      <ToggleButtonGroup
        sx={{ pt: 0.5 }}
        onChange={onChange}
        exclusive
        orientation={option.vertical ? 'vertical' : 'horizontal'}
      >
        {option.buttons.map(({ value, label, style }) => (
          <ToggleButton
            key={value}
            value={value}
            selected={value === currentValue}
            color={style?.color ?? 'standard'}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
};
