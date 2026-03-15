import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, Divider, IconButton, Popover, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { defaultTimerAdjustment, timerAdjustmentAtom } from '~/atoms/timerAdjustment';
import { defaultUnderlayAdjustment, underlayAdjustmentAtom } from '~/atoms/underlayAdjustment';

const UNDERLAY_STORAGE_KEY = 'RoLIMOA-underlay-adjustment';
const TIMER_STORAGE_KEY = 'RoLIMOA-timer-adjustment';

export const ScreenAdjustmentPanel = () => {
  const [underlayAdj, setUnderlayAdj] = useRecoilState(underlayAdjustmentAtom);
  const resetUnderlayAdj = useResetRecoilState(underlayAdjustmentAtom);
  const [timerAdj, setTimerAdj] = useRecoilState(timerAdjustmentAtom);
  const resetTimerAdj = useResetRecoilState(timerAdjustmentAtom);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnderlayReset = () => {
    resetUnderlayAdj();
    localStorage.removeItem(UNDERLAY_STORAGE_KEY);
  };

  const handleTimerReset = () => {
    resetTimerAdj();
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 10,
          color: 'white',
          opacity: 0.15,
          transition: 'opacity 0.3s',
          '&:hover': {
            opacity: 0.6,
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
          p: 0.5,
        }}
      >
        <TuneIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              width: 260,
              p: 2,
            },
          },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
          Underlay 表示調整
        </Typography>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            拡大: {underlayAdj.scale.toFixed(2)}
          </Typography>
          <Slider
            size="small"
            min={0.3}
            max={2.5}
            step={0.05}
            value={underlayAdj.scale}
            onChange={(_, value) => setUnderlayAdj((prev) => ({ ...prev, scale: value as number }))}
            onDoubleClick={() => setUnderlayAdj((prev) => ({ ...prev, scale: defaultUnderlayAdjustment.scale }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            縦位置: {underlayAdj.offsetY}px
          </Typography>
          <Slider
            size="small"
            min={-500}
            max={500}
            step={5}
            value={underlayAdj.offsetY}
            onChange={(_, value) => setUnderlayAdj((prev) => ({ ...prev, offsetY: value as number }))}
            onDoubleClick={() => setUnderlayAdj((prev) => ({ ...prev, offsetY: defaultUnderlayAdjustment.offsetY }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            間隔: {underlayAdj.gap}px
          </Typography>
          <Slider
            size="small"
            min={0}
            max={400}
            step={5}
            value={underlayAdj.gap}
            onChange={(_, value) => setUnderlayAdj((prev) => ({ ...prev, gap: value as number }))}
            onDoubleClick={() => setUnderlayAdj((prev) => ({ ...prev, gap: defaultUnderlayAdjustment.gap }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={handleUnderlayReset}
          sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)', width: '100%', mb: 2 }}
        >
          Underlayリセット ({defaultUnderlayAdjustment.scale} / {defaultUnderlayAdjustment.offsetY} /{' '}
          {defaultUnderlayAdjustment.gap}px)
        </Button>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />

        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
          タイマー 表示調整
        </Typography>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            大きさ: {timerAdj.scale.toFixed(2)}
          </Typography>
          <Slider
            size="small"
            min={0.5}
            max={2.0}
            step={0.05}
            value={timerAdj.scale}
            onChange={(_, value) => setTimerAdj((prev) => ({ ...prev, scale: value as number }))}
            onDoubleClick={() => setTimerAdj((prev) => ({ ...prev, scale: defaultTimerAdjustment.scale }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            縦位置: {timerAdj.offsetY}px
          </Typography>
          <Slider
            size="small"
            min={-200}
            max={200}
            step={5}
            value={timerAdj.offsetY}
            onChange={(_, value) => setTimerAdj((prev) => ({ ...prev, offsetY: value as number }))}
            onDoubleClick={() => setTimerAdj((prev) => ({ ...prev, offsetY: defaultTimerAdjustment.offsetY }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            背景透過度: {timerAdj.bgOpacity.toFixed(2)}
          </Typography>
          <Slider
            size="small"
            min={0}
            max={0.9}
            step={0.05}
            value={timerAdj.bgOpacity}
            onChange={(_, value) => setTimerAdj((prev) => ({ ...prev, bgOpacity: value as number }))}
            onDoubleClick={() => setTimerAdj((prev) => ({ ...prev, bgOpacity: defaultTimerAdjustment.bgOpacity }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={handleTimerReset}
          sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)', width: '100%' }}
        >
          タイマーリセット ({defaultTimerAdjustment.scale} / {defaultTimerAdjustment.offsetY} /{' '}
          {defaultTimerAdjustment.bgOpacity})
        </Button>
      </Popover>
    </>
  );
};
