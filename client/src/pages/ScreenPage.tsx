import { FC } from 'react';
import { ScoreBlock } from 'components/ScoreBlock';
import { TimerDisplay } from 'components/TimerDisplay';
import { usePlaySoundEffect } from 'functional/usePlaySoundEffect';
import { Box, Grid } from '@mui/material';

export const ScreenPage: FC = () => {
  usePlaySoundEffect();

  return (
    <Box sx={{ padding: '2em' }}>
      <Grid container spacing={6}>
        {/* スコア */}
        <Grid item container sx={{ justify: "space-between", alignItems: "center" }}>
          <Grid item xs={5}>
            <ScoreBlock fieldSide="blue" />
          </Grid>
          <Grid item xs={2}>
            {/* <IconButton aria-label="delete" color="default" onClick={onReverseClick}>
              <CachedIcon />
            </IconButton> */}
          </Grid>
          <Grid item xs={5}>
            <ScoreBlock fieldSide="red" />
          </Grid>
        </Grid>
        {/* タイム */}
        <TimerDisplay descriptionVariant="h2" displayTimeVariant="h1" />
      </Grid>
    </Box>
  );
}
