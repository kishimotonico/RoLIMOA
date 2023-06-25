import { FC } from 'react';
import { Grid } from '@mui/material';
import { CustomControlPanelType, TaskObjectConfigType } from '@/config/types';
import { ToggleSwitchControl } from './ToggleSwitchControl';
import { ToggleButtonControl } from './ToggleButtonControl';
import { PluseMinuseButtonControl } from './PluseMinuseButtonControl';

interface BaseControlProps {
  taskConfig: TaskObjectConfigType,
  controlConfig?: CustomControlPanelType,
  currentValue: number,
  stateUpdate: (value: number) => void,
  color?: "primary" | "secondary",
}

export const BaseControl: FC<BaseControlProps> = ({
  taskConfig,
  controlConfig,
  currentValue,
  stateUpdate,
  color,
}) => {
  const style = controlConfig?.style;

  return (
    <Grid item xs={12} sm={style?.width ?? 6}>
      {
        controlConfig?.type === "toggle_switch" ?
          <ToggleSwitchControl
            color={color ?? "default"}
            taskConfig={taskConfig}
            currentValue={currentValue}
            stateUpdate={stateUpdate}
            controlConfig={controlConfig}
          />
        : controlConfig?.type === "toggle_button" ?
          <ToggleButtonControl
            taskConfig={taskConfig}
            currentValue={currentValue}
            stateUpdate={stateUpdate}
            controlConfig={controlConfig}
          />
        : <PluseMinuseButtonControl
            color={color ?? "inherit"}
            config={taskConfig}
            currentValue={currentValue}
            stateUpdate={stateUpdate}
          />
      }
    </Grid>
  );
};
