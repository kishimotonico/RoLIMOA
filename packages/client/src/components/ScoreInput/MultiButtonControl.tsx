import { Box, Button, ButtonGroup, type ButtonProps, Paper, Typography } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { TaskObjectConfigType, taskObjectMultiButtonUiType } from '@rolimoa/common/config';
import { useCallback, useRef } from 'react';
import { useShortcutKey } from '~/functional/useShortcutKey';

interface MultiButtonControlProps {
  color: 'primary' | 'secondary' | 'inherit';
  taskConfig: TaskObjectConfigType;
  currentValue: number;
  stateUpdate: (value: number, cmd: string) => void;
  controlConfig: taskObjectMultiButtonUiType;
}

export const MultiButtonControl = ({
  color,
  taskConfig,
  currentValue,
  stateUpdate,
  controlConfig,
}: MultiButtonControlProps) => {
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

  const buttonProps = useCallback(
    (command: string) => {
      const cmd = command[0];
      const val = Number(command.slice(1));

      if (cmd === '=') {
        return {
          onClick: () => stateUpdate(val, command),
          disabled: currentValue === val,
        };
      }
      if (cmd === '+') {
        return {
          onClick: () => stateUpdate(currentValue + val, command),
          disabled: currentValue + val > max,
        };
      }
      if (cmd === '-') {
        return {
          onClick: () => stateUpdate(currentValue - val, command),
          disabled: currentValue - val < min,
        };
      }
      return {
        onClick: () => {
          console.error(`unexpected command: "${command}"`);
        },
        disabled: false,
      };
    },
    [currentValue, stateUpdate, min, max],
  );

  return (
    <Paper sx={{ p: '1em', userSelect: 'none' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {description}
      </Typography>
      <Typography component="p" variant="h5">
        {currentValue}
      </Typography>

      <Box sx={{ pt: 0.5 }}>
        <ButtonGroup sx={buttonGroupSx} color={color}>
          {controlConfig.option.buttons.map((button) => (
            <GroupedButton
              key={button.command}
              shortcutKey={button?.shortcutKey}
              buttonProps={{
                ...buttonProps(button.command),
                sx: innnerButtonSx,
                variant: button.style?.variant ?? 'contained',
              }}
            >
              {button.label}
            </GroupedButton>
          ))}
        </ButtonGroup>
      </Box>
    </Paper>
  );
};

const GroupedButton = (props: {
  children: React.ReactNode;
  buttonProps: ButtonProps;
  shortcutKey?: string;
}) => {
  const { children, buttonProps, shortcutKey } = props;

  const ref = useRef<HTMLButtonElement>(null);
  useShortcutKey(shortcutKey, () => {
    if (ref.current) {
      ref.current.click();
    }
  });

  return (
    <Button {...buttonProps} ref={ref}>
      {children}
    </Button>
  );
};
