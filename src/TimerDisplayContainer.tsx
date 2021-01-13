import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { TimerDisplayComponent, TimerDisplayStyleProps } from './TimerDisplayComponent';
import * as Phase from "./util/PhaseStateUtil";

function displayTime(elapsedSec: number, config: Required<Phase.TimeProgressConfig>): string {
  if (config.type === "ready") {
    return "READY";
  }
  let displaySec = elapsedSec;
  if (config.type === "countdown") {
    displaySec = config.time - elapsedSec;
  }
  if (config.time < elapsedSec) {
    displaySec = config.time;
  }
  const m = Math.floor(displaySec / 60);
  const s = displaySec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function calcElapsedSecond(startTime: number, nowTime?: number): number {
  const now = nowTime ?? Date.now();
  return Math.floor((now - startTime) / 1000);
}

type TimerDisplayContainerProps = {
  onTick?: (elapsedSecond: number) => void,
} & TimerDisplayStyleProps;

export const TimerDisplayContainer: FC<TimerDisplayContainerProps> = ({
  onTick = (_) => {},
  ...rest
}) => {
  const [second, setSecond] = useState(0);
  const timeoutHandler = useRef<NodeJS.Timeout|undefined>(undefined);
  const phaseState = useSelector<GlobalState, PhaseState>((state) => state.phaseState);

  useEffect(() => {
    // マウント時に、タイマをセットアップ
    function timerUpdate(): void {
      const config = Phase.getConfig(phaseState.id);
      if (config.type === "ready") {
        return; // READYタイプはカウントアップしない
      }
      const elapsedSec = calcElapsedSecond(phaseState.startTime);
      const nextTickTime = (elapsedSec + 1) * 1000 + phaseState.startTime;

      setSecond(_ => elapsedSec);
      onTick(elapsedSec);
  
      if (config.time < elapsedSec) {
        return; // 時間が経過したのでタイマ停止
      }
      timeoutHandler.current = setTimeout(timerUpdate, nextTickTime - Date.now());
    }
    timerUpdate();

    // アンマウント時にタイマを停止
    return () => {
      if (timeoutHandler.current !== undefined) {
        clearTimeout(timeoutHandler.current);
      }
    };
  }, [phaseState]); // eslint-disable-line react-hooks/exhaustive-deps

  const config = Phase.getConfig(phaseState.id);

  return (
    <TimerDisplayComponent
      displayTime={displayTime(second, config)}
      description={config.description}
      {...rest}
    />
  );
}
