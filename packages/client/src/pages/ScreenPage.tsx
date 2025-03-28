import { type FC, useState } from 'react';
import { ScoreBlock, type ScoreBlockProps } from '@/components/ScoreBlock';
import { TimerDisplay } from '@/components/TimerDisplay';
import { usePlaySoundEffect } from '@/functional/usePlaySoundEffect';
import { Box, Grid2, IconButton } from '@mui/material';
import { CenterFlex } from '@/ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';

export const ScreenPage: FC = () => {
  usePlaySoundEffect();

  const [reverse, setReverse] = useState(false);
  const onReverseClick = () => {
    setReverse((toggle) => !toggle);
  };

  const scoreBlockProps: Partial<ScoreBlockProps> = {
    rootSx: {
      borderWidth: '3px',
    },
    scoreVariant: 'h1',
    teamNameVariant: 'h4',
  };

  return (
    <Box sx={{ padding: '2em' }}>
      <Grid2 container spacing={6}>
        {/* スコア */}
        <Grid2
          size={12}
          container
          sx={{
            justify: 'space-between',
            alignItems: 'center',
            flexDirection: reverse ? 'row-reverse' : 'row',
          }}
        >
          <Grid2 size={5}>
            <ScoreBlock fieldSide="blue" {...scoreBlockProps} />
          </Grid2>
          <Grid2 size={2}>
            <CenterFlex
              sx={{
                opacity: 0.1,
                transition: 'opacity',
                '&:hover': {
                  opacity: 1.0,
                },
              }}
            >
              <IconButton
                aria-label="delete"
                color="default"
                onClick={onReverseClick}
              >
                <CachedIcon />
              </IconButton>
            </CenterFlex>
          </Grid2>
          <Grid2 size={5}>
            <ScoreBlock fieldSide="red" {...scoreBlockProps} />
          </Grid2>
        </Grid2>
        {/* タイム */}
        <Grid2 size={12}>
          <TimerDisplay
            descriptionSx={{
              marginTop: '.5em',
              marginBottom: '.5em',
              fontSize: '400%',
            }}
            displayTimeSx={{
              fontSize: '1200%',
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};
