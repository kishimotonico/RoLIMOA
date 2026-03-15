import CachedIcon from '@mui/icons-material/Cached';
import { Box, IconButton } from '@mui/material';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { timerAdjustmentAtom } from '~/atoms/timerAdjustment';
import { underlayAdjustmentAtom } from '~/atoms/underlayAdjustment';
import { ScoreBoard } from '~/components/Screen/ScoreBoard';
import { ScreenAdjustmentPanel } from '~/components/Screen/ScreenAdjustmentPanel';
import { TimerDisplay } from '~/components/Screen/TimerDisplay';
import { Underlay } from '~/components/Screen/Underlay';
import { useAutoPlaySoundEffect } from '~/functional/useAutoPlaySoundEffect';
import { CenterFlex } from '~/ui/CenterFlex';

export const ScreenPage = () => {
  useAutoPlaySoundEffect();

  const [reverse, setReverse] = useState(false);
  const onReverseClick = () => {
    setReverse((toggle) => !toggle);
  };

  const { scale, offsetY, gap } = useRecoilValue(underlayAdjustmentAtom);
  const { scale: timerScale, offsetY: timerOffsetY, bgOpacity } = useRecoilValue(timerAdjustmentAtom);

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
              transform: `translateY(${timerOffsetY}px)`,
            }}
          >
            <Box
              sx={{
                transform: `scale(${timerScale})`,
                transformOrigin: 'center center',
                backgroundColor: `rgba(0,0,0,${bgOpacity})`,
                borderRadius: bgOpacity > 0 ? 1 : 0,
                px: bgOpacity > 0 ? 1 : 0,
              }}
            >
              <TimerDisplay />
            </Box>
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
            transform: `scale(${scale}) translateY(${offsetY}px)`,
            transformOrigin: 'center center',
          }}
        >
          <Underlay gap={gap} />
        </Box>

        <ScreenAdjustmentPanel />
      </Box>
    </Box>
  );
};
