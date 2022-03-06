import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSetRecoilState } from 'recoil';
import { timerClockState } from './atoms/timerClockState';
import { RootState } from './features';
import { PhaseState } from './features/phase';
import { isGapPhase } from './util/PhaseStateUtil';

function calcElapsedSecond(startTime: number): number {
  const now = Date.now();
  const sec = Math.floor((now - startTime) / 1000);
  if (sec > 0) {
    return sec;
  }
  console.warn("ふぇぇ…elapsedSecoundが負だよぉ");
  return 0;
}

export const LocalTimerClock: FC = () => {
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  const setTimerClockState = useSetRecoilState(timerClockState);

  useEffect(() => {
    function timerUpdate(): void {
      const elapsedSec = calcElapsedSecond(phaseState.startTime);
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      if (isGapPhase(phaseState.id, nextTickTime)) {
        // 隙間（時刻では既に次のフェーズだが、まだサーバからその更新がこないとき
        console.info(`ふぇぇ…${phaseState.id}が時間を超過したよぉ`);
      } else {
        // 次の時刻に遷移
        setTimerClockState(_ => elapsedSec);
      }

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

  return <></>;
}
