import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, IconButton, Popover, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { defaultUnderlayAdjustment, underlayAdjustmentAtom } from '~/atoms/underlayAdjustment';

const LOCAL_STORAGE_KEY = 'RoLIMOA-underlay-adjustment';

export const UnderlayAdjustmentPanel = () => {
  const [adjustment, setAdjustment] = useRecoilState(underlayAdjustmentAtom);
  const resetAdjustment = useResetRecoilState(underlayAdjustmentAtom);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReset = () => {
    resetAdjustment();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
            拡大: {adjustment.scale.toFixed(2)}
          </Typography>
          <Slider
            size="small"
            min={0.3}
            max={2.5}
            step={0.05}
            value={adjustment.scale}
            onChange={(_, value) => setAdjustment((prev) => ({ ...prev, scale: value as number }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            横位置: {adjustment.offsetX}px
          </Typography>
          <Slider
            size="small"
            min={-500}
            max={500}
            step={5}
            value={adjustment.offsetX}
            onChange={(_, value) => setAdjustment((prev) => ({ ...prev, offsetX: value as number }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            縦位置: {adjustment.offsetY}px
          </Typography>
          <Slider
            size="small"
            min={-500}
            max={500}
            step={5}
            value={adjustment.offsetY}
            onChange={(_, value) => setAdjustment((prev) => ({ ...prev, offsetY: value as number }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            間隔: {adjustment.gap}px
          </Typography>
          <Slider
            size="small"
            min={0}
            max={400}
            step={5}
            value={adjustment.gap}
            onChange={(_, value) => setAdjustment((prev) => ({ ...prev, gap: value as number }))}
            sx={{ color: 'white' }}
          />
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={handleReset}
          sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.3)', width: '100%' }}
        >
          リセット ({defaultUnderlayAdjustment.scale} / {defaultUnderlayAdjustment.offsetX} /{' '}
          {defaultUnderlayAdjustment.offsetY} / {defaultUnderlayAdjustment.gap}px)
        </Button>
      </Popover>
    </>
  );
};
