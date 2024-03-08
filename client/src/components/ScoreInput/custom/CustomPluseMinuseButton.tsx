import { FC } from 'react';
import { Button, Paper, Typography, ButtonGroup, Grid } from '@mui/material';

interface CustomPluseMinuseButtonProps {
  color: "primary" | "secondary",
  value: number,
  label: React.ReactNode,
  onChange: (value: number) => void,
  min?: number,
  max?: number,
}

export const CustomPluseMinuseButton: FC<CustomPluseMinuseButtonProps> = ({
  color,
  value,
  label,
  onChange: stateUpdate,
  min = 0,
  max = 9999,
}) => {
  return (
    <Paper sx={{ p: '1em 0.7em', userSelect: 'none' }}>
      <Grid container alignItems='center' gap='1em'>
        <Grid item>
          <ButtonGroup
            size='small'
          >
            <Button
              variant='outlined'
              color={color}
              onClick={() => stateUpdate(value - 1)}
              sx={{ width: '3em', height: '3em'}}
              disabled={value <= min}
            >
              －
            </Button>
            <Button
              variant='outlined'
              color={color}
              sx={{ width: '3em', height: '3em'}}
            >
              <Typography variant='h6'>{value}</Typography>
            </Button>
            <Button
              variant='contained'
              color={color}
              onClick={() => stateUpdate(value + 1)}
              sx={{ width: '3em', height: '3em'}}
              disabled={value >= max}
            >
              ＋
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item zeroMinWidth>
          <Typography variant='h6' noWrap>{label}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
