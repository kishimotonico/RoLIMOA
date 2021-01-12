import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { TimerDisplayComponent, TimerDisplayStyleProps } from './TimerDisplayComponent';
import * as Phase from "./util/PhaseStateUtil";

function displayTime(currentSec: number, config: Phase.TimeProgressConfig): string {
  if (config.type === "ready") {
    return "READY";
  }
  let displaySec = currentSec;
  if (config.type === "countdown") {
    displaySec = (config.time ?? 0) - currentSec;
  }
  if ((config.time ?? Number.MAX_SAFE_INTEGER) < currentSec) {
    displaySec = (config.time ?? Number.MAX_SAFE_INTEGER);
  }
  const m = Math.floor(displaySec / 60);
  const s = displaySec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function calcElapsedSecond(startTime: number, nowTime?: number): number {
  const now = nowTime ?? Date.now();
  return Math.floor((now - startTime) / 1000);
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
      if (phaseState === undefined) {
        return;
      }

      const config = Phase.getConfig(phaseState.id);
      if (config.type === "ready") {
        return; // READYタイプはカウントアップしない
      }
      const elapsedSec = calcElapsedSecond(phaseState.startTime);
      const limitSec = config.time ?? Number.MAX_SAFE_INTEGER;
      if (limitSec < elapsedSec) {
        return; // 時間が経過したので次回タイマ停止
      }

      setSecond(sec => sec + 1);
      timeoutHandler.current = setTimeout(timerUpdate, 1000); // 時刻の微調整のため再帰的なsetTimeoutに
    }
    const now = Date.now();
    const elapsedSec = calcElapsedSecond(phaseState.startTime, now);
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

  // ローディング中のとき
  if (phaseState === undefined) {
    return <></>;
  }

  const config = Phase.getConfig(phaseState.id);

  return (
    <TimerDisplayComponent
      displayTime={displayTime(second, config)}
      description={config.description}
      {...props}
    />
  );
}