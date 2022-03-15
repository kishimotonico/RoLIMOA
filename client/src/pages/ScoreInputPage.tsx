import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Fab, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import { Dashboard } from '../components/Dashboard';
import { TaskObject } from '../components/TaskObjectContainer';
import { ScoreBoard } from '../components/ScoreBoard';
import { RootState } from '../slices';
import { scoreStateSlice } from '../slices/score';
import { LyricalSocket } from '../lyricalSocket';
import config from '../config.json';
import { ScoreInputVgloaButton } from '../components/ScoreInputVgoalButton';

interface ScoreInputPageProps {
  fieldSide: "blue" | "red";
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 10,
  },
}));

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const classes = useStyles();
  const isScoreEnable = useSelector<RootState, boolean>((state) => state.score[fieldSide].enable);
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

  const kanji = {blue: "青", red: "赤"}[fieldSide];
  const color = fieldSide === "blue" ? "primary" : "secondary";  

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {
              config.rule.task_objects.map(config => (
                <TaskObject
                  key={config.id}
                  fieldSide={fieldSide}
                  {...config}
                />
              ))
            }
            <Grid item xs={12}>
              <ScoreInputVgloaButton fieldSide={fieldSide} color={color} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ScoreBoard focusedFieldSide={fieldSide}/>
        </Grid>

        <Backdrop open={! isScoreEnable} className={classes.backdrop}>
          <Fab color="default" variant="extended" onClick={onEnableButton}>
            <CheckIcon />
            スコアを有効化
          </Fab>
        </Backdrop>
      </Grid>
    </Dashboard>
  );
}
