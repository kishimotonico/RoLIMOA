import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'slices';
import { calculateElapsedSecond, CurrentPhaseState, phaseStateSlice } from 'slices/phase';

export const AppRootTimer: FC = () => {
  const dispatch = useDispatch();
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);

  useEffect(() => {
    function timerUpdate(): void {
      const elapsedSec = calculateElapsedSecond(phaseState.startTime);
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      dispatch(phaseStateSlice.actions.setElapsedSecond({
        newElapsedSecond: elapsedSec,
      }));

      timeoutHandler.current = setTimeout(timerUpdate, nextTickTime - Date.now());
    }
    // マウント時に、タイマをセットアップ
    timerUpdate();

    // アンマウント時にタイマを停止
    return () => {
      if (timeoutHandler.current !== undefined) {
        clearTimeout(timeoutHandler.current);
      }
    };
  }, [phaseState]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
