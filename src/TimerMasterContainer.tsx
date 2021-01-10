import React, { FC, useCallback, useEffect } from 'react';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch, useSelector } from 'react-redux';
import { setPhaseTick } from "./actions";
import { GlobalState, PhaseState } from './reducer';
import { TimerMasterComponent } from './TimerMasterComponent';

function displayTime(time: number|undefined) {
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

export const TimerMasterContainer: FC = () => {
  const phaseState = useSelector<GlobalState, PhaseState>((state) => state.phaseState);
  const dispatch = useDispatch();

  const onNextPhase = useCallback(() => {
    const socket = LyricalSocket.instance;

    socket.socket.emit("set_next_phase", {});
  }, []);

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance;

    socket.socket.on("tick", (message: {elapsedTime: number }) => {
      // console.log("tick", message);
      const now = new Date();
      console.log(`${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`);
      dispatch(setPhaseTick({ elapsedTime: message.elapsedTime }));
    });
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return <TimerMasterComponent displayTime={displayTime(phaseState.elapsedTime)} description={phaseState.description} onNextPhase={onNextPhase}/>;
}
