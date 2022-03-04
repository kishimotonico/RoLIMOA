import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, makeStyles } from '@material-ui/core';
import { RootState } from './features';
import { scoreStateSlice, ScoreStateType } from './features/score';
import { useRecoilValue } from 'recoil';
import { timerClockState } from './atoms/timerClockState';
import { LyricalSocket } from './lyricalSocket';
import * as Vgoal from './util/VgoalHelper';

const useStyles = makeStyles((theme) => ({
  vgoalButton: {
    width: '100%',
    fontSize: '180%',
    lineHeight: 2.4,
  },
}));

type ScoreInputVgloaButtonProps = {
  fieldSide: "blue" | "red",
  color: "primary" | "secondary",
};

export const ScoreInputVgloaButton: FC<ScoreInputVgloaButtonProps> = ({
  fieldSide,
  color,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  const timerClock = useRecoilValue(timerClockState);

  const onVgoalButton = useCallback(() => {
    const vgoalTime = timerClock ?? 0;
    const action = scoreStateSlice.actions.setVgoalTime({ fieldSide, vgoalTime });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide, timerClock]);

  const onVgoalCancelButton = useCallback(() => {
    const action = scoreStateSlice.actions.unsetVgoalTime({ fieldSide });
    dispatch(action);

    const socket = LyricalSocket.instance.socket;
    socket.emit("dispatch", action);
  }, [dispatch, fieldSide]);

  const isVgoaled = scoreState.vgoal === undefined;

  return (
    <Button
      variant="contained"
      size="medium" 
      onClick={isVgoaled ? onVgoalButton : onVgoalCancelButton}
      disabled={isVgoaled ? Vgoal.isVgoalAvailable(scoreState) : false}
      color={isVgoaled ? color : "default"}
      className={classes.vgoalButton}
    >
      {isVgoaled ? "Vゴール 達成" : "Vゴール 取り消し"}
    </Button>
  );
};
