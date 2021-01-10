import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { TimerDisplayComponent, TimerDisplayStyleProps } from './TimerDisplayComponent';

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
  const [timer, setTimer] = useState<NodeJS.Timeout|null>(null);
  const phaseState = useSelector<GlobalState, PhaseState>((state) => state.phaseState);
  // const [beforeTime, setBeforeTime] = useState(0);
  // const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    function timerUpdate(): void {
      setSecond(sec => sec + 1);
      setTimer(setTimeout(timerUpdate, 1000));  // 時刻の微調整のため再帰的なsetTimeoutに
    }
    
    setTimer(setTimeout(timerUpdate, 1000));

    return () => {
      console.log("clear timer");
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <TimerDisplayComponent displayTime={displayTime(second)} description={phaseState.description} {...props}/>;
}
