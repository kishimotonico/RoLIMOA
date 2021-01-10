import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { TimerDisplayComponent, TimerDisplayStyleProps } from './TimerDisplayComponent';
import * as Phase from "./util/PhaseStateUtil";

function displayTime(time: number|undefined): string {
  if (time === undefined) {
    return "READY";
  }
  if (typeof time === "number") {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return "";
}

export const TimerDisplayContainer: FC<TimerDisplayStyleProps> = (props) => {
  const [second, setSecond] = useState(0);
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<GlobalState, PhaseState|undefined>((state) => state.phaseState);

  useEffect(() => {
    // マウント時に、タイマをセットアップ
    if (phaseState === undefined) {
      return () => {};  // フェーズ状態の読み込み中なので何もしない
    }
    function timerUpdate(): void {
      setSecond(sec => sec + 1);
      timeoutHandler.current = setTimeout(timerUpdate, 1000); // 時刻の微調整のため再帰的なsetTimeoutに
    }
    const now = Date.now();
    const elapsedSec = Math.floor((now - phaseState.startTime) / 1000);
    const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;
    setSecond(elapsedSec);
    timeoutHandler.current = setTimeout(() => { timerUpdate(); }, nextTickTime - now);

    // アンマウント時にタイマを停止
    return () => {
      if (timeoutHandler.current !== undefined) {
        console.log("clear timer");
        clearTimeout(timeoutHandler.current);
      }
    };
  }, [phaseState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerDisplayComponent
      displayTime={displayTime(second)}
      description={ phaseState === undefined ? "" : Phase.getConfig(phaseState.id).description }
      {...props}
    />
  );
}