import { FC, useCallback } from 'react';
import { Button, ButtonGroup, Box, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/material/styles'
import { TaskObjectConfigType } from '@/config/types';

interface PluseMinuseButtonControlProps {
  color: "primary" | "secondary" | "inherit",
  config: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number, cmd: string) => void,
}

export const PluseMinuseButtonControl: FC<PluseMinuseButtonControlProps> = ({
  color,
  config,
  currentValue,
  stateUpdate,
}) => {
  const { description, min = 0, max = 524 } = config;

  const decrement = useCallback(() => {
    stateUpdate(currentValue - 1, "-1");
  }, [currentValue, stateUpdate]);

  const increment = useCallback(() => {
    stateUpdate(currentValue + 1, "+1");
  }, [currentValue, stateUpdate]);

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
          <Button sx={innnerButtonSx} variant="outlined" onClick={decrement} disabled={currentValue === min}>
            -1
          </Button>
          <Button sx={innnerButtonSx} variant="contained" onClick={increment} disabled={currentValue === max}>
            +1
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
};
