import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { TaskObjectConfigType } from '@rolimoa/common/config';
import { useCallback } from 'react';

interface PlusMinusButtonControlProps {
  color: 'primary' | 'secondary' | 'inherit';
  config: TaskObjectConfigType;
  currentValue: number;
  stateUpdate: (value: number, cmd: string) => void;
}

export const PlusMinusButtonControl = ({
  color,
  config,
  currentValue,
  stateUpdate,
}: PlusMinusButtonControlProps) => {
  const { description, min = 0, max = 524 } = config;

  const decrement = useCallback(() => {
    stateUpdate(currentValue - 1, '-1');
  }, [currentValue, stateUpdate]);

  const increment = useCallback(() => {
    stateUpdate(currentValue + 1, '+1');
  }, [currentValue, stateUpdate]);

  // styles
  const buttonGroupSx: SxProps = {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    verticalAlign: 'baseline',
    padding: '0 .25em 0 0',
  };
  const innerButtonSx: SxProps = {
    width: '50%',
  };

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
          <Button
            sx={innerButtonSx}
            variant="outlined"
            onClick={decrement}
            disabled={currentValue === min}
          >
            -1
          </Button>
          <Button
            sx={innerButtonSx}
            variant="contained"
            onClick={increment}
            disabled={currentValue === max}
          >
            +1
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
};
