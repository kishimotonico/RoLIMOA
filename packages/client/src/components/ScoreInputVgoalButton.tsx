import { Button } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import { type FieldScoreStateType, scoreStateSlice } from '@rolimoa/common/redux';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentMatchState } from '~/functional/useCurrentMatchState';
import { LyricalSocket } from '~/lyricalSocket';
import { isVgoalAvailable } from '~/util/VgoalHelper';

type ScoreInputVgoalButtonProps = {
  fieldSide: 'blue' | 'red';
  color: 'primary' | 'secondary';
};

export const ScoreInputVgoalButton = ({ fieldSide, color }: ScoreInputVgoalButtonProps) => {
  const dispatch = useDispatch();
  const scoreState = useSelector<RootState, FieldScoreStateType>(
    (state) => state.score.fields[fieldSide],
  );
  const elapsedSec = useSelector<RootState, number>((state) => state.phase.elapsedSecond);
  const currentMatchState = useCurrentMatchState(fieldSide);

  const onVgoalButton = useCallback(() => {
    const vgoalTime = elapsedSec;
    const action = scoreStateSlice.actions.setVgoalTime({
      fieldSide,
      vgoalTime,
    });
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
      disabled={isNotVgoaled ? !isVgoalAvailable(currentMatchState) : false}
      color={isNotVgoaled ? color : 'grey'}
      sx={{
        width: '100%',
        fontSize: '100%',
        lineHeight: 2.4,
      }}
    >
      {isNotVgoaled ? 'Vゴール 達成' : 'Vゴール 取り消し'}
    </Button>
  );
};
