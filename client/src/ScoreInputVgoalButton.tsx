import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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

  const isNotVgoaled = scoreState.vgoal === undefined;

  return (
    <Button
      variant="contained"
      size="medium" 
      onClick={isNotVgoaled ? onVgoalButton : onVgoalCancelButton}
      disabled={isNotVgoaled ? !Vgoal.isVgoalAvailable(scoreState) : false}
      color="info"
      // color={isNotVgoaled ? color : "default"}
      className={classes.vgoalButton}
    >
      {isNotVgoaled ? "Vゴール 達成" : "Vゴール 取り消し"}
    </Button>
  );
};
