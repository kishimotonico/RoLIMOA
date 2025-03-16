import { FC } from 'react';
import { Grid2, Paper } from '@mui/material';
import { ScoreBlock } from './ScoreBlock';

interface ScoreBoardProps {
  focusedFieldSide?: "blue"|"red"|undefined;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({
  focusedFieldSide = undefined,
}) => {
  const [blueFocused, redFocused] = (focusedFieldSide === "blue") ? [true, false]
                                  : (focusedFieldSide === "red")  ? [false, true]
                                  : [undefined, undefined];

  return (
    <Paper sx={{ padding: '1em' }}>
      <Grid2 container spacing={3}>
        <Grid2 size={12}>
          <ScoreBlock fieldSide="blue" focused={blueFocused} />
        </Grid2>
        <Grid2 size={12}>
          <ScoreBlock fieldSide="red" focused={redFocused} />
        </Grid2>
      </Grid2>
    </Paper>
  );
};
