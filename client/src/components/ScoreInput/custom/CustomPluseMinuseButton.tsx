import { FC } from 'react';
import { Button, Paper, Typography, Stack, ButtonGroup } from '@mui/material';

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
    <Paper sx={{ p: '1em', userSelect: 'none' }}>
      <Stack direction='row' alignItems='center' gap='1em'>
        <ButtonGroup
          size='small'
        >
          <Button
            variant='outlined'
            color={color}
            onClick={() => stateUpdate(value - 1)}
            sx={{ width: '3em' }}
            disabled={value <= min}
          >
            －
          </Button>
          <Button
            variant='outlined'
            color={color}
            sx={{ width: '3em' }}
          >
            <Typography variant='h6'>{value}</Typography>
          </Button>
          <Button
            variant='contained'
            color={color}
            onClick={() => stateUpdate(value + 1)}
            sx={{ width: '3em' }}
            disabled={value >= max}
          >
            ＋
          </Button>
        </ButtonGroup>
        <Typography variant='h6'>{label}</Typography>
      </Stack>
    </Paper>
  );
};