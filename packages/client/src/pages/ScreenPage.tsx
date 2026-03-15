import CachedIcon from '@mui/icons-material/Cached';
import { Box, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { scoreboardAdjustmentAtom } from '~/atoms/scoreboardAdjustment';
import { screenDisplayAtom } from '~/atoms/screenDisplayAtom';
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

  const [screenDisplay, setScreenDisplay] = useRecoilState(screenDisplayAtom);
  const { reverse } = screenDisplay;

  const onReverseClick = () => {
    setScreenDisplay((prev) => ({ ...prev, reverse: !prev.reverse }));
  };

  const { scale, offsetY, gap, opacity } = useRecoilValue(underlayAdjustmentAtom);
  const { scale: timerScale, offsetY: timerOffsetY, bgOpacity } = useRecoilValue(timerAdjustmentAtom);
  const { scale: scoreboardScale, offsetY: scoreboardOffsetY, scoreScale, teamNameScale } = useRecoilValue(scoreboardAdjustmentAtom);

  // カーソル自動非表示
  const [cursorVisible, setCursorVisible] = useState(true);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setCursorVisible(true);
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
      cursorTimerRef.current = setTimeout(() => {
        setCursorVisible(false);
      }, 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        height: '99vh',
        overflow: 'hidden',
        cursor: cursorVisible ? 'default' : 'none',
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
        {/* スコアボード */}
        <Box
          sx={{
            transform: `scale(${scoreboardScale}) translateY(${scoreboardOffsetY}px)`,
            transformOrigin: 'top center',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1 }}>
              <ScoreBoard fieldSide={reverse ? 'blue' : 'red'} placement="left" scoreScale={scoreScale} teamNameScale={teamNameScale} />
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
              <ScoreBoard fieldSide={reverse ? 'red' : 'blue'} placement="right" scoreScale={scoreScale} teamNameScale={teamNameScale} />
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
                backgroundColor: `rgba(255,255,255,${bgOpacity})`,
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
            opacity: opacity ?? 1.0,
            transition: 'opacity 0.3s',
          }}
        >
          <Underlay gap={gap} reverse={reverse} />
        </Box>

        <ScreenAdjustmentPanel />
      </Box>
    </Box>
  );
};
