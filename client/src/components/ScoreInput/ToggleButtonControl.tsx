import { FC, useCallback } from 'react';
import { ToggleButtonGroup, ToggleButton, Paper, Typography } from '@mui/material';
import { TaskObjectConfigType, TaskObjectToggleButtonUiType } from '@/config/types';

interface ToggleButtonControlProps {
  taskConfig: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number) => void,
  controlConfig: TaskObjectToggleButtonUiType,
}

export const ToggleButtonControl: FC<ToggleButtonControlProps> = ({
  taskConfig,
  currentValue,
  stateUpdate,
  controlConfig,
}) => {
  const { description } = taskConfig;
  const option = controlConfig.option;

  const onChange = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    stateUpdate(value);
  }, [stateUpdate]);

  return (
    <Paper sx={{ p: '1em', userSelect: "none" }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>

      <ToggleButtonGroup 
        sx={{ pt: 0.5 }}
        onChange={onChange} 
        exclusive 
        orientation={option.vertical ? "vertical" : "horizontal"}
      >
        {
          option.buttons.map(({value, label, style}) => (
            <ToggleButton
              key={value}
              value={value}
              selected={value === currentValue}
              color={style?.color ?? "standard"}
            >
              {label}
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>
    </Paper>
  );
};
