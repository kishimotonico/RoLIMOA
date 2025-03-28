import type { FC } from 'react';
import { Paper, Typography, Grid2, Button, ButtonGroup, Box } from '@mui/material'; // Grid2に変更
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import { TimerDisplay } from './TimerDisplay';
import type { TimeProgressConfigType } from '@/config/types';
import type { CurrentPhaseState } from '@/slices/phase';
import { ConditionalTooltip } from '@/ui/ConditionalTooltip';
import { unixToTimeWithMillis } from '@/util/formatTime';

interface TimerMasterComponentProps {
  isFirstPhase: boolean,
  isLastPhase: boolean,
  isPaused: boolean,
  pausedElapsedSecond?: number,
  onFirstPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onPrevPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onPauseButton: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onNextPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onLastPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onTimeChange: (ms: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  isEnabledNextButton: boolean,
  phaseConfig: TimeProgressConfigType,
  currentPhaseState: CurrentPhaseState,
}

export const TimerMasterComponent: FC<TimerMasterComponentProps> = ({
  isFirstPhase,
  isLastPhase,
  isPaused,
  pausedElapsedSecond,
  onFirstPhase,
  onPrevPhase,
  onPauseButton,
  onNextPhase,
  onLastPhase,
  onTimeChange,
  isEnabledNextButton,
  phaseConfig,
  currentPhaseState,
}) => {
  return (
    <Paper sx={{ padding: '1em' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        時刻マスタ
      </Typography>
      <Grid2 container spacing={1}>
        <Grid2 container size={{ xs: 8 }} spacing={1}>
          <Grid2 size={12}>
            <TimerDisplay
              descriptionVariant="h6"
              displayTimeVariant="h2"
            />
          </Grid2>
          <Grid2 size={12} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          </Grid2>
          <Grid2 size={12} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <ButtonGroup size="small" variant="text" color="inherit" sx={{
              opacity: 0.8,
              transition: '0.3s',
              border: '1px solid rgba(0, 0, 0, 0.23)',
            }}>
              <Button onClick={onTimeChange(-10 * 1000)} disabled={!isPaused}>
                -10
              </Button>
              <Button onClick={onTimeChange(-1 * 1000)} disabled={!isPaused}>
                -1
              </Button>
              <Button disabled={!isPaused} sx={{
                width: "6rem",
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  // 今はボタンとして機能しないので
                  cursor: 'default',
                  backgroundColor: 'inherit',
                },
              }}>
                {isPaused ? `${pausedElapsedSecond} s` : "進行中"}
              </Button>
              <Button onClick={onTimeChange(+1 * 1000)} disabled={!isPaused}>
                +1
              </Button>
              <Button onClick={onTimeChange(+10 * 1000)} disabled={!isPaused}>
                +10
              </Button>
            </ButtonGroup>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 4 }}>
          <Box mb={3}>
            <Typography variant="body2" color="textSecondary">
              id: {currentPhaseState.id} ({phaseConfig.type})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              startTime: {unixToTimeWithMillis(currentPhaseState.startTime)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              pausedTime: {currentPhaseState.pausedTime ? unixToTimeWithMillis(currentPhaseState.pausedTime) : "undefined"}
            </Typography>
          </Box>

          <ButtonGroup variant="contained" color="inherit" sx={{
            width: '100%',
            mb: 1,
            opacity: .2,
            transition: '0.3s',
            '&:hover': {
              opacity: '0.75',
            },
          }}>
            <ConditionalTooltip condition={!isFirstPhase} title="最初のフェーズに" placement='top'>
              <Button onClick={onFirstPhase} disabled={isFirstPhase}>
                <SkipPreviousIcon />
              </Button>
            </ConditionalTooltip>
            <ConditionalTooltip condition={!isFirstPhase} title="前のフェーズに" placement='top'>
              <Button onClick={onPrevPhase} disabled={isFirstPhase}>
                <FastRewindIcon />
              </Button>
            </ConditionalTooltip>
            <ConditionalTooltip condition={phaseConfig.type === "count"} title={isPaused ? "再開" : "一時停止"} placement='top'>
              <Button onClick={onPauseButton} disabled={phaseConfig.type !== "count"}>
                {
                  isPaused ? <PlayArrowIcon /> : <PauseIcon />
                }
              </Button>
            </ConditionalTooltip>
            <ConditionalTooltip condition={!isLastPhase} title="次のフェーズに" placement='top'>
              <Button onClick={onNextPhase} disabled={isLastPhase}>
                <FastForwardIcon />
              </Button>
            </ConditionalTooltip>
            <ConditionalTooltip condition={!isLastPhase} title="最初のフェーズに" placement='top'>
              <Button onClick={onLastPhase} disabled={isLastPhase}>
                <SkipNextIcon />
              </Button>
            </ConditionalTooltip>
          </ButtonGroup>

          <Button
            variant="contained"
            color="primary"
            onClick={onNextPhase}
            disabled={!isEnabledNextButton}
            fullWidth
          >
            次のフェーズへ <SkipNextIcon />
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
