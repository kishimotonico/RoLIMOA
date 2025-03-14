import { FC } from 'react';
import { Paper, Typography, Grid, Button, ButtonGroup, Tooltip, Box } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { TimerDisplay } from './TimerDisplay';
import { TimeProgressConfigType } from '@/config/types';
import styled from '@emotion/styled';
import { CurrentPhaseState } from '@/slices/phase';
import { Label } from '@mui/icons-material';

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
            <ButtonGroup size="small" sx={{ 
              opacity: .2,
              transition: '0.3s',
              '&:hover': {
                opacity: '0.75',
              },
             }}>
              <Tooltip title="最初のフェーズに">
                <span>
                  <Button variant="contained" color="grey" onClick={onFirstPhase} disabled={isFirstPhase}>
                    <SkipPreviousIcon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="前のフェーズに">
                <span>
                  <Button variant="contained" color="grey" onClick={onPrevPhase} disabled={isFirstPhase}>
                    <FastRewindIcon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={isPaused ? "再開" : "一時停止"}>
                <span>
                  <Button variant="contained" color="grey" onClick={onPauseButton} disabled={phaseConfig.type !== "count"}>
                    {
                      isPaused ? <PlayArrowIcon /> : <PauseIcon />
                    }
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="次のフェーズに">
                <span>
                  <Button variant="contained" color="grey" onClick={onNextPhase} disabled={isLastPhase}>
                    <FastForwardIcon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="最初のフェーズに">
                <span>
                  <Button variant="contained" color="grey" onClick={onLastPhase} disabled={isLastPhase}>
                    <SkipNextIcon />
                  </Button>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Grid>
          {isPaused && <Grid item xs={12} sx={{ 
            display: 'flex',
            justifyContent: 'center',
           }}>
            <ButtonGroup size="small" sx={{ 
              opacity: 0.8,
              transition: '0.3s',
             }}>
              <Tooltip title="-10s">
                <span>
                  <Button variant="contained" color="grey" onClick={onTimeChange(-10 * 1000)} disabled={isFirstPhase}>
                    <Replay10Icon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="-1s">
                <span>
                  <Button variant="contained" color="grey" onClick={onTimeChange(-1 * 1000)} disabled={isFirstPhase}>
                    <RemoveIcon />
                  </Button>
                </span>
              </Tooltip>
              <LabelInButtonGroup>
                {pausedElapsedSecond ? `${pausedElapsedSecond} s` : "ー"} 
              </LabelInButtonGroup>
              <Tooltip title="+1s">
                <span>
                  <Button variant="contained" color="grey" onClick={onTimeChange(+1 * 1000)} disabled={isLastPhase}>
                    <AddIcon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="+10s">
                <span>
                  <Button variant="contained" color="grey" onClick={onTimeChange(+10 * 1000)} disabled={isLastPhase}>
                    <Forward10Icon />
                  </Button>
                </span>
              </Tooltip>
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

const LabelInButtonGroup = (props: { children: React.ReactNode }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 1,
      paddingRight: 1,
      cursor: 'default',
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
     }}>
      {props.children}
    </Box>
  );
}
