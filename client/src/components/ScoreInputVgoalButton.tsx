import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { RootState } from 'slices';
import { scoreStateSlice, ScoreStateType } from 'slices/score';
import { LyricalSocket } from 'lyricalSocket';
import * as Vgoal from 'util/VgoalHelper';

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
  const elapsedSec = useSelector<RootState, number>((state) => state.phase.elapsedSecond);

  const onVgoalButton = useCallback(() => {
    const vgoalTime = elapsedSec;
    const action = scoreStateSlice.actions.setVgoalTime({ fieldSide, vgoalTime });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, elapsedSec]);

  const onVgoalCancelButton = useCallback(() => {
    const action = scoreStateSlice.actions.unsetVgoalTime({ fieldSide });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide]);

  const isNotVgoaled = scoreState.vgoal === undefined;

  return (
    <Button
      variant="contained"
      size="medium" 
      onClick={isNotVgoaled ? onVgoalButton : onVgoalCancelButton}
      disabled={isNotVgoaled ? !Vgoal.isVgoalAvailable(scoreState) : false}
      color={isNotVgoaled ? color : "grey"}
      className={classes.vgoalButton}
    >
      {isNotVgoaled ? "Vゴール 達成" : "Vゴール 取り消し"}
    </Button>
  );
};
