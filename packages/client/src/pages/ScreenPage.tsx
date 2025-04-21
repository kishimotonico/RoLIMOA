import { ScoreBoard } from '@/components/Screen/ScoreBoard';
import { TimerDisplay } from '@/components/Screen/TimerDisplay';
import { Underlay } from '@/components/Screen/Underlay';
import { usePlaySoundEffect } from '@/functional/usePlaySoundEffect';
import { CenterFlex } from '@/ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';
import { Box, IconButton } from '@mui/material';
import { useState } from 'react';

export const ScreenPage = () => {
  usePlaySoundEffect();

  const [reverse, setReverse] = useState(false);
  const onReverseClick = () => {
    setReverse((toggle) => !toggle);
  };

  return (
    <Box
      sx={{
        height: '99vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          fontSize: '50px',
          height: '100vh',
          p: 0.5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box>
          {/* スコア */}
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1 }}>
              <ScoreBoard fieldSide={reverse ? 'blue' : 'red'} placement="left" />
            </Box>
            <CenterFlex
              sx={{
                opacity: 0.3,
                transition: 'opacity',
                '&:hover': {
                  opacity: 1.0,
                },
                width: '80px',
                fontSize: '20px',
              }}
            >
              <IconButton color="default" onClick={onReverseClick}>
                <CachedIcon />
              </IconButton>
            </CenterFlex>
            <Box sx={{ flex: 1 }}>
              <ScoreBoard fieldSide={reverse ? 'red' : 'blue'} placement="right" />
            </Box>
          </Box>
          {/* タイム */}
          <CenterFlex
            sx={{
              py: '0.5em',
            }}
          >
            <TimerDisplay />
          </CenterFlex>
        </Box>

        {/* underlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: -100,
          }}
        >
          <Underlay />
        </Box>
      </Box>
    </Box>
  );
};
