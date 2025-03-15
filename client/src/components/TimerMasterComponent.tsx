import { FC } from 'react';
import { Paper, Typography, Grid, Button, ButtonGroup } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import { TimerDisplay } from './TimerDisplay';
import { TimeProgressConfigType } from '@/config/types';
import styled from '@emotion/styled';
import { CurrentPhaseState } from '@/slices/phase';
import { ConditionalTooltip } from '@/ui/ConditionalTooltip';

const DetailInfoUl = styled('ul')({
  paddingInlineStart: '22px',
  color: 'text.secondary',
});

const DetailInfoHead = styled('span')({
  paddingRight: '.5em',
});

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
}) => {
  return (
    <Paper sx={{ padding: '1em' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        時刻マスタ
      </Typography>
      <Grid container spacing={1}>
        <Grid item container xs={8} spacing={1}>
          <Grid item xs={12}>
            <TimerDisplay
              descriptionVariant="h6"
              displayTimeVariant="h2"
            />
          </Grid>
          <Grid item xs={12} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <ButtonGroup size="small" variant="contained" color="inherit" sx={{
              opacity: .2,
              transition: '0.3s',
              '&:hover': {
                opacity: '0.75',
              },
            }}>
              <ConditionalTooltip condition={!isFirstPhase} title="最初のフェーズに">
                <Button onClick={onFirstPhase} disabled={isFirstPhase}>
                  <SkipPreviousIcon />
                </Button>
              </ConditionalTooltip>
              <ConditionalTooltip condition={!isFirstPhase} title="前のフェーズに">
                <Button onClick={onPrevPhase} disabled={isFirstPhase}>
                  <FastRewindIcon />
                </Button>
              </ConditionalTooltip>
              <ConditionalTooltip condition={phaseConfig.type === "count"} title={isPaused ? "再開" : "一時停止"}>
                <Button onClick={onPauseButton} disabled={phaseConfig.type !== "count"}>
                  {
                    isPaused ? <PlayArrowIcon /> : <PauseIcon />
                  }
                </Button>
              </ConditionalTooltip>
              <ConditionalTooltip condition={!isLastPhase} title="次のフェーズに">
                <Button onClick={onNextPhase} disabled={isLastPhase}>
                  <FastForwardIcon />
                </Button>
              </ConditionalTooltip>
              <ConditionalTooltip condition={!isLastPhase} title="最初のフェーズに">
                <Button onClick={onLastPhase} disabled={isLastPhase}>
                  <SkipNextIcon />
                </Button>
              </ConditionalTooltip>
            </ButtonGroup>
          </Grid>
          {isPaused && <Grid item xs={12} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <ButtonGroup size="small" variant="text" color="inherit" sx={{
              opacity: 0.8,
              transition: '0.3s',
              border: '1px solid rgba(0, 0, 0, 0.23)',
            }}>
              <Button onClick={onTimeChange(-10 * 1000)} disabled={isFirstPhase}>
                -10
              </Button>
              <Button onClick={onTimeChange(-1 * 1000)} disabled={isFirstPhase}>
                -1
              </Button>
              <Button sx={{
                width: "6rem",
                fontSize: '1rem',
                textTransform: 'none',
              }}>
                {pausedElapsedSecond ? `${pausedElapsedSecond} s` : "ー"}
              </Button>
              <Button onClick={onTimeChange(+1 * 1000)} disabled={isLastPhase}>
                +1
              </Button>
              <Button onClick={onTimeChange(+10 * 1000)} disabled={isLastPhase}>
                +10
              </Button>
            </ButtonGroup>
          </Grid>}
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={onNextPhase}
            disabled={!isEnabledNextButton}
            sx={{ width: '100%' }}
          >
            次のフェーズへ <SkipNextIcon />
          </Button>
          <DetailInfoUl>
            <li>
              <DetailInfoHead>id:</DetailInfoHead>
              <span>{phaseConfig.id}</span>
            </li>
            <li>
              <DetailInfoHead>type:</DetailInfoHead>
              <span>{phaseConfig.type}</span>
            </li>
            <li>
              <DetailInfoHead>autoTransition:</DetailInfoHead>
              <span>{phaseConfig.isAutoTransition ? "true" : "false"}</span>
            </li>
          </DetailInfoUl>
        </Grid>
      </Grid>
    </Paper>
  );
}
