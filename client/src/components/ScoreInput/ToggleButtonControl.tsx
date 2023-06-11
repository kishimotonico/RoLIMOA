import { FC, useCallback } from 'react';
import { ToggleButtonGroup, ToggleButton, Grid, Paper, Typography } from '@mui/material';
import { TaskObjectConfigType, TaskObjectToggleButtonUiType } from 'config/types';

interface ToggleButtonControlProps {
  config: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number) => void,
  controlConfig: TaskObjectToggleButtonUiType,
}

export const ToggleButtonControl: FC<ToggleButtonControlProps> = ({
  config,
  currentValue,
  stateUpdate,
  controlConfig,
}) => {
  const { description } = config;
  const option = controlConfig.option;

  const onChange = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    stateUpdate(value);
  }, [stateUpdate]);

  return (
    <Grid item xs={12} sm={6}>
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
    </Grid>
  );
};
