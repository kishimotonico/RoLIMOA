import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { RootState } from '@/slices';
import { calculateElapsedSecond, CurrentPhaseState, phaseStateSlice } from '@/slices/phase';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';

export const AppRootTimer: FC = () => {
  const dispatch = useDispatch();
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);
  const offsetTime = useRecoilValue(unixtimeOffset);

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
      const nowUnixtime = Date.now() + offsetTime;
      const elapsedSec = calculateElapsedSecond(phaseState.startTime, nowUnixtime);
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      const newElapsedSecond = Math.max(0, elapsedSec);
      dispatch(phaseStateSlice.actions.setElapsedSecond({
        newElapsedSecond,
      }));

      const oldTimer = timeoutHandler.current;
      timeoutHandler.current = setTimeout(timerUpdate, nextTickTime - nowUnixtime);
      console.debug(` |- timerUpd: ${elapsedSec} (${phaseState.id})[${oldTimer ?? "none"}→${timeoutHandler.current}]`);
    }
    // マウント時に、タイマをセットアップ
    timerUpdate();

    // アンマウント時にタイマを停止
    return () => {
      console.debug(`|- useEffect close: ${phaseState.id}`);
      timerClear();
    };
  }, [phaseState, offsetTime]); // eslint-disable-line react-hooks/exhaustive-deps

  return <></>;
}
