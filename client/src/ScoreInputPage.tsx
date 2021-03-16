import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Button, Fab, Grid, makeStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { Dashboard } from './Dashboard';
import { TaskObject } from './TaskObjectContainer';
import { ScoreBoard } from './ScoreBoard';
import { RootState } from './features';
import { scoreStateSlice, ScoreStateType } from './features/score';
import { PhaseState } from './features/phase';
import { LyricalSocket } from './lyricalSocket';
import config from './config.json';
import * as Vgoal from './util/VgoalHelper';

interface ScoreInputPageProps {
  fieldSide: "blue" | "red";
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 10,
  },
  vgoalButton: {
    width: '100%',
    fontSize: '180%',
    lineHeight: 2.4,
  },
}));

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const classes = useStyles();
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const dispatch = useDispatch();

  const onEnableButton = useCallback(() => {
    const action = scoreStateSlice.actions.setScoreEnable({
      fieldSide,
      enable: true,
    });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide]);

  const onVgoalButton = useCallback(() => {
    const vgoalTime = Math.floor((Date.now() - phaseState.startTime) / 1000);
    const action = scoreStateSlice.actions.setVgoalTime({
      fieldSide,
      vgoalTime,
    });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide, phaseState]);

  const onVgoalCancelButton = useCallback(() => {
    const action = scoreStateSlice.actions.unsetVgoalTime({ fieldSide });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide]);

  const kanji = {blue: "青", red: "赤"}[fieldSide];
  const color = fieldSide === "blue" ? "primary" : "secondary";  
  const vgoalButtonFlag = scoreState.vgoal === undefined;

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {config.rule.task_objects.map(config => (
              <TaskObject {...config} fieldSide={fieldSide}/>
            ))}
            <Grid item xs={12}>
              {scoreState.vgoal === undefined}
              {/* TODO: Vゴールボタン、別コンポーネントに切り出してリファクタ */}
              <Button
                variant="contained" size="medium" 
                onClick={vgoalButtonFlag ? onVgoalButton : onVgoalCancelButton}
                disabled={vgoalButtonFlag ? Vgoal.isVgoalAvailable(scoreState) : false}
                color={vgoalButtonFlag ? color : "default"}
                className={classes.vgoalButton}
              >
                {vgoalButtonFlag ? "Vゴール 達成" : "Vゴール 取り消し"}
              </Button>
            </Grid>
          </Grid>
        </Grid>


        <Grid item xs={12} lg={4}>
          <ScoreBoard focusedFieldSide={fieldSide}/>
        </Grid>

        <Backdrop open={! scoreState.enable} className={classes.backdrop}>
          <Fab color="default" variant="extended" onClick={onEnableButton}>
            <CheckIcon />
            スコアを有効化
          </Fab>
        </Backdrop>
      </Grid>
    </Dashboard>
  );
}
