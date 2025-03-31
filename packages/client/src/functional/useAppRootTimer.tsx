import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import type { RootState } from '@rolimoa/common/redux';
import {
  calculateElapsedSecond,
  type CurrentPhaseState,
  phaseStateSlice,
} from '@rolimoa/common/redux';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';

export const useAppRootTimer = () => {
  const dispatch = useDispatch();
  const timeoutHandler = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseState = useSelector<RootState, CurrentPhaseState>(
    (state) => state.phase.current,
  );
  const phaseStateRef = useRef<CurrentPhaseState | undefined>(undefined); // タイマーの二重起動防止
  const offsetTime = useRecoilValue(unixtimeOffset);

  console.log(
    `AppRootTimer: ${phaseState.id} started at ${phaseState.startTime}`,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    phaseStateRef.current = phaseState;
    console.debug(
      `|- useEffect init: ${phaseState.id} [${timeoutHandler.current}]`,
    );

    // マウント時に、タイマをセットアップ
    timerUpdate();

    function timerUpdate(): void {
      if (
        phaseStateRef.current?.id !== phaseState.id ||
        phaseStateRef.current?.startTime !== phaseState.startTime
      ) {
        console.error(
          'ふぇぇ！タイマーが不安定になったから修正したよぉ',
          phaseStateRef.current,
          phaseState,
        );
        return;
      }

      // 今の実装だとOffsetが初期状態で反映されないので、うまいことやる
      if (phaseState.pausedTime) {
        console.debug(` |- timerUpd: ${phaseState.id} paused!`);
        return;
      }

      const nowUnixtime = Date.now() + offsetTime;
      const elapsedSec = calculateElapsedSecond(
        phaseState.startTime,
        nowUnixtime,
      );
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      const newElapsedSecond = Math.max(0, elapsedSec);
      dispatch(
        phaseStateSlice.actions.setElapsedSecond({
          newElapsedSecond,
        }),
      );

      const oldTimer = timeoutHandler.current;
      timeoutHandler.current = setTimeout(
        timerUpdate,
        nextTickTime - nowUnixtime,
      );
      console.debug(
        ` |- timerUpd: ${elapsedSec} (${phaseState.id})[${oldTimer ?? 'none'}→${timeoutHandler.current}]`,
      );
    }

    function timerClear(): void {
      if (timeoutHandler.current !== undefined) {
        console.debug(
          ` |- timerClear: ${phaseState.id} [${timeoutHandler.current}]`,
        );
        clearTimeout(timeoutHandler.current);
        timeoutHandler.current = undefined;
      }
    }

    // アンマウント時にタイマを停止
    return () => {
      console.debug(`|- useEffect close: ${phaseState.id}`);
      timerClear();
    };
  }, [phaseState, offsetTime]);
};
