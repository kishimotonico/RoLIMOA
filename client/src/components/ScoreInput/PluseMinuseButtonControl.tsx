import { FC, useCallback } from 'react';
import { Button, ButtonGroup, Box, Grid, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/material/styles'
import { FieldSideType } from 'slices/score';
import { TaskObjectConfigType } from 'config/types';

interface PluseMinuseButtonControlProps {
  fieldSide: FieldSideType,
  config: TaskObjectConfigType,
  currentValue: number,
  stateUpdate: (value: number) => void,
}

export const PluseMinuseButtonControl: FC<PluseMinuseButtonControlProps> = ({
  fieldSide,
  config,
  currentValue,
  stateUpdate,
}) => {
  const { description, min = 0, max = 524 } = config;

  const decrement = useCallback(() => {
    stateUpdate(currentValue - 1);
  }, [currentValue, stateUpdate]);

  const increment = useCallback(() => {
    stateUpdate(currentValue + 1);
  }, [currentValue, stateUpdate]);

  // styles
  const color = fieldSide === "blue" ? "primary" : "secondary";
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
    <Grid item xs={12} sm={6}>
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
    </Grid>
  );
};
