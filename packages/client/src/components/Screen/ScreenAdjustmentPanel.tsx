import TuneIcon from '@mui/icons-material/Tune';
import { Box, ButtonBase, Divider, Popover, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);
    return () => {
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseleave', hide);
    };
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
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
      <ButtonBase
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          borderRadius: '20px',
          px: 2,
          py: 0.75,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(255,255,255,0.4)',
          transition: 'background-color 0.2s, border-color 0.2s, opacity 0.3s',
          opacity: open || visible ? 1 : 0,
          pointerEvents: open || visible ? 'auto' : 'none',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.7)',
          },
        }}
      >
        <TuneIcon sx={{ fontSize: 18 }} />
        <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1 }}>
          表示調整
        </Typography>
      </ButtonBase>

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Underlay 表示調整
          </Typography>
          <ButtonBase
            onClick={handleUnderlayReset}
            sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', '&:hover': { color: 'rgba(255,255,255,0.9)' } }}
          >
            リセット
          </ButtonBase>
        </Box>

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

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            タイマー 表示調整
          </Typography>
          <ButtonBase
            onClick={handleTimerReset}
            sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', '&:hover': { color: 'rgba(255,255,255,0.9)' } }}
          >
            リセット
          </ButtonBase>
        </Box>

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

      </Popover>
    </>
  );
};
