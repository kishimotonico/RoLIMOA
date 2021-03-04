import React, { FC } from 'react';
import { Paper, Typography, Grid, Button, makeStyles, ButtonGroup, Tooltip } from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';

import { TimerDisplayContainer } from './TimerDisplayContainer';
import * as Phase from "./util/PhaseStateUtil";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em',
  },
  controlButtons: {
    display: 'flex',
    justifyContent: 'center',
  },
  controlButtonsGroup: {
    opacity: .2,
    transition: '0.3s',
    '&:hover': {
      opacity: '0.75',
    },
  },
  displayDescription: {
    minHeight: `${theme.typography.h6.lineHeight}em`,
  },
  nextButton: {
    width: '100%',
  },
  detailInfo: {
    paddingInlineStart: '22px',
    color: theme.palette.text.secondary,
  },
  detailInfoHead: {
    paddingRight: '.5em',
  },
  detailInfoBody: {

  },
}));

interface TimerMasterComponentProps {
  onTick: (elapsedSecond: number) => void,
  isFirstPhase: boolean,
  isLastPhase: boolean,
  onFirstPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onPrevPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onNextPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onLastPhase: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  isEnabledNextButton: boolean,
  phaseConfig: Phase.TimeProgressConfig,
}

export const TimerMasterComponent: FC<TimerMasterComponentProps> = ({
  onTick,
  isFirstPhase,
  isLastPhase,
  onFirstPhase,
  onPrevPhase,
  onNextPhase,
  onLastPhase,
  isEnabledNextButton,
  phaseConfig
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        時刻マスタ
      </Typography>
      <Grid container spacing={1}>
        <Grid item container xs={8} spacing={1}>
          <Grid item xs={12}>
            <TimerDisplayContainer
              descriptionVariant="h6"
              displayTimeVariant="h2"
              onTick={onTick}
            />
          </Grid>
          <Grid item xs={12} className={classes.controlButtons}>
            <ButtonGroup size="small" className={classes.controlButtonsGroup}>
              {/* 未実装 */}
              <Tooltip title="最初のフェーズに">
                <Button variant="contained" color="default" onClick={onFirstPhase} disabled={isFirstPhase}>
                  <SkipPreviousIcon />
                </Button>
              </Tooltip>
              <Tooltip title="前のフェーズに">
                <Button variant="contained" color="default" onClick={onPrevPhase} disabled={isFirstPhase}>
                  <FastRewindIcon />
                </Button>
              </Tooltip>
              <Tooltip title="【未実装】一時停止/再開">
                <Button variant="contained" color="default" onClick={() => {}} disabled={true}>
                  <PauseIcon />
                </Button>
              </Tooltip>
              <Tooltip title="次のフェーズに">
                <Button variant="contained" color="default" onClick={onNextPhase} disabled={isLastPhase}>
                  <FastForwardIcon />
                </Button>
              </Tooltip>
              <Tooltip title="最初のフェーズに">
                <Button variant="contained" color="default" onClick={onLastPhase} disabled={isLastPhase}>
                  <SkipNextIcon />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={onNextPhase}
            disabled={!isEnabledNextButton}
            className={classes.nextButton}
          >
            次のフェーズへ <SkipNextIcon />
          </Button>
          <ul className={classes.detailInfo}>
            <li>
              <span className={classes.detailInfoHead}>id:</span>
              <span className={classes.detailInfoBody}>{phaseConfig.id}</span>
            </li>
            <li>
              <span className={classes.detailInfoHead}>type:</span>
              <span className={classes.detailInfoBody}>{phaseConfig.type}</span>
            </li>
            <li>
              <span className={classes.detailInfoHead}>time:</span>
              <span className={classes.detailInfoBody}>{phaseConfig.time}</span>
            </li>
            <li>
              <span className={classes.detailInfoHead}>autoTransition:</span>
              <span className={classes.detailInfoBody}>{phaseConfig.isAutoTransition ? "true" : "false"}</span>
            </li>
          </ul>
        </Grid>
      </Grid>
    </Paper>
  );
}
