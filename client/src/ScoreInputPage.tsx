import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Fab, Grid, makeStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { Dashboard } from './Dashboard';
import { TaskObject } from './TaskObjectContainer';
import { ScoreBoard } from './ScoreBoard';
import { RootState, scoreStateSlice } from './store';
import config from './config.json';
import { LyricalSocket } from './lyricalSocket';

interface ScoreInputPageProps {
  fieldSide: "blue" | "red";
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 10,
  },
}));

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const kanji = {blue: "青", red: "赤"}[fieldSide];
  const classes = useStyles();
  const isScoreEnable = useSelector<RootState, boolean>((state) => state.score[fieldSide].enable);
  const dispatch = useDispatch();

  const onEnableButton = useCallback(() => {
    const action = scoreStateSlice.actions.setScoreEnable({
      fieldSide,
      enable: true,
    });
    console.log(action);
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide]);

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {config.rule.task_objects.map(config => (
              <TaskObject {...config} fieldSide={fieldSide}/>
            ))}
          </Grid>
        </Grid>
        <Backdrop open={! isScoreEnable} className={classes.backdrop}>
          <Fab color="default" variant="extended" onClick={onEnableButton}>
            <CheckIcon />
            スコアを有効化
          </Fab>
        </Backdrop>

        <Grid item xs={12} lg={4}>
          <ScoreBoard focusedFieldSide={fieldSide}/>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
