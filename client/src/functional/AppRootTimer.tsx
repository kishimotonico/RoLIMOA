import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { calculateElapsedSecond, CurrentPhaseState, phaseStateSlice } from '@/slices/phase';

export const AppRootTimer: FC = () => {
  const dispatch = useDispatch();
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);

  console.log(`AppRootTimer: ${phaseState.id} started at ${phaseState.startTime}`);

  useEffect(() => {
    function timerClear(): void {
      if (timeoutHandler.current !== undefined) {
        console.debug(` |- timerClear: ${phaseState.id} [${timeoutHandler.current}]`);
        clearTimeout(timeoutHandler.current);
        timeoutHandler.current = undefined;
      }
    }
    console.debug(`|- useEffect init: ${phaseState.id} [${timeoutHandler.current}]`);
    timerClear();

    function timerUpdate(): void {
      const elapsedSec = calculateElapsedSecond(phaseState.startTime);
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      const newElapsedSecond = Math.max(0, elapsedSec);
      dispatch(phaseStateSlice.actions.setElapsedSecond({
        newElapsedSecond,
      }));

      const oldTimer = timeoutHandler.current;
      timeoutHandler.current = setTimeout(timerUpdate, nextTickTime - Date.now());
      console.debug(` |- timerUpd: ${elapsedSec} (${phaseState.id})[${oldTimer ?? "none"}→${timeoutHandler.current}]`);
    }
    // マウント時に、タイマをセットアップ
    timerUpdate();

    // アンマウント時にタイマを停止
    return () => {
      console.debug(`|- useEffect close: ${phaseState.id}`);
      timerClear();
    };
  }, [phaseState]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div>{phaseState.id} [{timeoutHandler.current as number | undefined}]</div>;
}
