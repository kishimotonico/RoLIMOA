import { FC, useState } from 'react';
import { ScoreBlock } from 'components/ScoreBlock';
import { TimerDisplay } from 'components/TimerDisplay';
import { usePlaySoundEffect } from 'functional/usePlaySoundEffect';
import { Box, Grid, IconButton } from '@mui/material';
import { CenterFlex } from 'ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';

export const ScreenPage: FC = () => {
  usePlaySoundEffect();

  const [reverse, setReverse] = useState(false);
  const onReverseClick = () => { setReverse(toggle => !toggle) };
  
  return (
    <Box sx={{ padding: '2em' }}>
      <Grid container spacing={6}>
        {/* スコア */}
        <Grid item container sx={{ 
          justify: "space-between", 
          alignItems: "center", 
          flexDirection: reverse ? "row-reverse" : "row",
        }}>
          <Grid item xs={5}>
            <ScoreBlock fieldSide="blue" />
          </Grid>
          <Grid item xs={2}>
            <CenterFlex sx={{
              opacity: 0.1,
              transition: "opacity",
              "&:hover": {
                opacity: 1.0,
              },
            }}>
              <IconButton aria-label="delete" color="default" onClick={onReverseClick}>
                <CachedIcon />
              </IconButton>
            </CenterFlex>
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
