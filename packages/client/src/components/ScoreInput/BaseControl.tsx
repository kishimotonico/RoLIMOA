import { Grid2 } from '@mui/material';
import type { CustomControlPanelType, TaskObjectConfigType } from '@rolimoa/common/config';
import { MultiButtonControl } from './MultiButtonControl';
import { PlusMinuseButtonControl } from './PlusMinuseButtonControl';
import { ToggleButtonControl } from './ToggleButtonControl';
import { ToggleSwitchControl } from './ToggleSwitchControl';

interface BaseControlProps {
  taskConfig: TaskObjectConfigType;
  controlConfig?: CustomControlPanelType;
  currentValue: number;
  stateUpdate: (value: number, cmd: string) => void;
  color?: 'primary' | 'secondary';
}

export const BaseControl = ({
  taskConfig,
  controlConfig,
  currentValue,
  stateUpdate,
  color,
}: BaseControlProps) => {
  const style = controlConfig?.style;

  return (
    <Grid2 size={{ xs: 12, sm: style?.width ?? 6 }}>
      {controlConfig?.type === 'toggle_switch' ? (
        <ToggleSwitchControl
          color={color ?? 'default'}
          taskConfig={taskConfig}
          currentValue={currentValue}
          stateUpdate={stateUpdate}
          controlConfig={controlConfig}
        />
      ) : controlConfig?.type === 'toggle_button' ? (
        <ToggleButtonControl
          taskConfig={taskConfig}
          currentValue={currentValue}
          stateUpdate={stateUpdate}
          controlConfig={controlConfig}
        />
      ) : controlConfig?.type === 'multi_button' ? (
        <MultiButtonControl
          color={color ?? 'inherit'}
          taskConfig={taskConfig}
          currentValue={currentValue}
          stateUpdate={stateUpdate}
          controlConfig={controlConfig}
        />
      ) : (
        <PlusMinuseButtonControl
          color={color ?? 'inherit'}
          config={taskConfig}
          currentValue={currentValue}
          stateUpdate={stateUpdate}
        />
      )}
    </Grid2>
  );
};
