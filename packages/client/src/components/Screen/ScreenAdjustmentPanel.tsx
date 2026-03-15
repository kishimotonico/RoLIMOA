import TuneIcon from '@mui/icons-material/Tune';
import { Box, ButtonBase, Divider, Popover, Slider, Switch, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { defaultScoreboardAdjustment, scoreboardAdjustmentAtom } from '~/atoms/scoreboardAdjustment';
import { screenDisplayAtom } from '~/atoms/screenDisplayAtom';
import { defaultTimerAdjustment, timerAdjustmentAtom } from '~/atoms/timerAdjustment';
import { defaultUnderlayAdjustment, underlayAdjustmentAtom } from '~/atoms/underlayAdjustment';


type AdjustSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onReset: () => void;
  format?: (v: number) => string;
};

const AdjustSlider = ({ label, value, min, max, step, onChange, onReset, format }: AdjustSliderProps) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
      {label}: {format ? format(value) : value}
    </Typography>
    <Slider
      size="small"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(_, v) => onChange(v as number)}
      onDoubleClick={onReset}
      sx={{ color: 'white' }}
    />
  </Box>
);

type SectionHeaderProps = {
  title: string;
  onReset: () => void;
};

const SectionHeader = ({ title, onReset }: SectionHeaderProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
    <Typography variant="caption" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    <ButtonBase
      onClick={onReset}
      sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', '&:hover': { color: 'rgba(255,255,255,0.9)' } }}
    >
      リセット
    </ButtonBase>
  </Box>
);

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ToggleRow = ({ label, checked, onChange }: ToggleRowProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
      {label}
    </Typography>
    <Switch
      size="small"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.5)' },
        '& .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.2)' },
      }}
    />
  </Box>
);

export const ScreenAdjustmentPanel = () => {
  const [screenDisplay, setScreenDisplay] = useRecoilState(screenDisplayAtom);
  const resetScreenDisplay = useResetRecoilState(screenDisplayAtom);

  const [scoreboardAdj, setScoreboardAdj] = useRecoilState(scoreboardAdjustmentAtom);
  const resetScoreboardAdj = useResetRecoilState(scoreboardAdjustmentAtom);

  const [underlayAdj, setUnderlayAdj] = useRecoilState(underlayAdjustmentAtom);
  const resetUnderlayAdj = useResetRecoilState(underlayAdjustmentAtom);

  const [timerAdj, setTimerAdj] = useRecoilState(timerAdjustmentAtom);
  const resetTimerAdj = useResetRecoilState(timerAdjustmentAtom);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFullscreenToggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // フルスクリーンAPIが失敗した場合は無視
    }
  };

  const handleScreenDisplayReset = () => {
    resetScreenDisplay();
  };

  const handleScoreboardReset = () => {
    resetScoreboardAdj();
  };

  const handleUnderlayReset = () => {
    resetUnderlayAdj();
  };

  const handleTimerReset = () => {
    resetTimerAdj();
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
              width: 340,
              p: 2,
              maxHeight: '80vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '2px' },
            },
          },
        }}
      >
        {/* 全般セクション */}
        <SectionHeader title="全般" onReset={handleScreenDisplayReset} />

        <ToggleRow
          label="赤青入替"
          checked={screenDisplay.reverse}
          onChange={(checked) => setScreenDisplay((prev) => ({ ...prev, reverse: checked }))}
        />

        <ToggleRow
          label="フルスクリーン"
          checked={isFullscreen}
          onChange={handleFullscreenToggle}
        />

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />

        {/* 画面全体セクション */}
        <SectionHeader title="画面全体" onReset={handleScoreboardReset} />

        <AdjustSlider
          label="大きさ"
          value={scoreboardAdj.scale}
          min={0.5}
          max={2.0}
          step={0.05}
          onChange={(v) => setScoreboardAdj((prev) => ({ ...prev, scale: v }))}
          onReset={() => setScoreboardAdj((prev) => ({ ...prev, scale: defaultScoreboardAdjustment.scale }))}
          format={(v) => v.toFixed(2)}
        />

        <AdjustSlider
          label="縦位置"
          value={scoreboardAdj.offsetY}
          min={-200}
          max={200}
          step={5}
          onChange={(v) => setScoreboardAdj((prev) => ({ ...prev, offsetY: v }))}
          onReset={() => setScoreboardAdj((prev) => ({ ...prev, offsetY: defaultScoreboardAdjustment.offsetY }))}
          format={(v) => `${v}px`}
        />

        <AdjustSlider
          label="得点の大きさ"
          value={scoreboardAdj.scoreScale ?? 1.0}
          min={0.5}
          max={3.0}
          step={0.05}
          onChange={(v) => setScoreboardAdj((prev) => ({ ...prev, scoreScale: v }))}
          onReset={() => setScoreboardAdj((prev) => ({ ...prev, scoreScale: defaultScoreboardAdjustment.scoreScale }))}
          format={(v) => v.toFixed(2)}
        />

        <AdjustSlider
          label="チーム名の大きさ"
          value={scoreboardAdj.teamNameScale ?? 1.0}
          min={0.5}
          max={3.0}
          step={0.05}
          onChange={(v) => setScoreboardAdj((prev) => ({ ...prev, teamNameScale: v }))}
          onReset={() => setScoreboardAdj((prev) => ({ ...prev, teamNameScale: defaultScoreboardAdjustment.teamNameScale }))}
          format={(v) => v.toFixed(2)}
        />

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />

        {/* Underlayセクション */}
        <SectionHeader title="Underlay" onReset={handleUnderlayReset} />

        <AdjustSlider
          label="不透明度"
          value={underlayAdj.opacity ?? 1.0}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => setUnderlayAdj((prev) => ({ ...prev, opacity: v }))}
          onReset={() => setUnderlayAdj((prev) => ({ ...prev, opacity: defaultUnderlayAdjustment.opacity }))}
          format={(v) => v.toFixed(2)}
        />

        <AdjustSlider
          label="拡大"
          value={underlayAdj.scale}
          min={0.3}
          max={2.5}
          step={0.05}
          onChange={(v) => setUnderlayAdj((prev) => ({ ...prev, scale: v }))}
          onReset={() => setUnderlayAdj((prev) => ({ ...prev, scale: defaultUnderlayAdjustment.scale }))}
          format={(v) => v.toFixed(2)}
        />

        <AdjustSlider
          label="縦位置"
          value={underlayAdj.offsetY}
          min={-500}
          max={500}
          step={5}
          onChange={(v) => setUnderlayAdj((prev) => ({ ...prev, offsetY: v }))}
          onReset={() => setUnderlayAdj((prev) => ({ ...prev, offsetY: defaultUnderlayAdjustment.offsetY }))}
          format={(v) => `${v}px`}
        />

        <AdjustSlider
          label="間隔"
          value={underlayAdj.gap}
          min={0}
          max={400}
          step={5}
          onChange={(v) => setUnderlayAdj((prev) => ({ ...prev, gap: v }))}
          onReset={() => setUnderlayAdj((prev) => ({ ...prev, gap: defaultUnderlayAdjustment.gap }))}
          format={(v) => `${v}px`}
        />

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />

        {/* タイマーセクション */}
        <SectionHeader title="タイマー" onReset={handleTimerReset} />

        <AdjustSlider
          label="大きさ"
          value={timerAdj.scale}
          min={0.5}
          max={2.0}
          step={0.05}
          onChange={(v) => setTimerAdj((prev) => ({ ...prev, scale: v }))}
          onReset={() => setTimerAdj((prev) => ({ ...prev, scale: defaultTimerAdjustment.scale }))}
          format={(v) => v.toFixed(2)}
        />

        <AdjustSlider
          label="縦位置"
          value={timerAdj.offsetY}
          min={-200}
          max={200}
          step={5}
          onChange={(v) => setTimerAdj((prev) => ({ ...prev, offsetY: v }))}
          onReset={() => setTimerAdj((prev) => ({ ...prev, offsetY: defaultTimerAdjustment.offsetY }))}
          format={(v) => `${v}px`}
        />

        <AdjustSlider
          label="背景透過度"
          value={timerAdj.bgOpacity}
          min={0}
          max={0.9}
          step={0.05}
          onChange={(v) => setTimerAdj((prev) => ({ ...prev, bgOpacity: v }))}
          onReset={() => setTimerAdj((prev) => ({ ...prev, bgOpacity: defaultTimerAdjustment.bgOpacity }))}
          format={(v) => v.toFixed(2)}
        />
      </Popover>
    </>
  );
};
