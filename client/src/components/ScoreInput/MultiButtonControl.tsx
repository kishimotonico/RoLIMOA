import { FC, useCallback } from 'react';
import { Button, ButtonGroup, Box, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/material/styles'
import { TaskObjectConfigType, taskObjectMultiButtonUiType } from '@/config/types';

interface MultiButtonControlProps {
  color: "primary" | "secondary" | "inherit",
  taskConfig: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number, cmd: string) => void,
  controlConfig: taskObjectMultiButtonUiType,
}

export const MultiButtonControl: FC<MultiButtonControlProps> = ({
  color,
  taskConfig,
  currentValue,
  stateUpdate,
  controlConfig,
}) => {
  const { description, min = 0, max = 524 } = taskConfig;

  // styles
  const buttonGroupSx: SxProps = {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    verticalAlign: 'baseline',
    padding: '0 .25em 0 0',
  };
  const innnerButtonSx: SxProps = {
    width: '50%',
  };

  const buttonProps = useCallback((command: string) => {
    const cmd = command[0];
    const val = Number(command.slice(1));

    if (cmd === "=") {
      return {
        onClick: () => stateUpdate(val, command),
        disabled: currentValue === val,
      };
    }
    if (cmd === "+") {
      return {
        onClick: () => stateUpdate(currentValue + val, command),
        disabled: currentValue + val > max,
      };
    }
    if (cmd === "-") {
      return {
        onClick: () => stateUpdate(currentValue - val, command),
        disabled: currentValue - val < min,
      };
    }
    return {
      onClick: () => { console.error(`unexpected command: "${command}"`) },
      disabled: false,
    };
  }, [currentValue, stateUpdate, min, max]);

  return (
    <Paper sx={{ p: '1em', userSelect: "none" }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>
      <Typography component="p" variant="h5" >
        {currentValue}
      </Typography>

      <Box sx={{ pt: 0.5 }}>
        <ButtonGroup sx={buttonGroupSx} color={color}>
          {
            controlConfig.option.buttons.map((button) => {
              const { disabled, onClick } = buttonProps(button.command);

              return <Button
                key={button.command}
                sx={innnerButtonSx}
                variant={button.style?.variant ?? "contained"}
                onClick={onClick}
                disabled={disabled}
              >
                {button.label}
              </Button>
            })
          }
        </ButtonGroup>
      </Box>
    </Paper>
  );
};
