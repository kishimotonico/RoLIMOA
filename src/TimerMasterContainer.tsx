import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { LyricalSocket } from './lyricalSocket';
import { TimerMasterComponent } from './TimerMasterComponent';
import * as Phase from "./util/PhaseStateUtil";

export const TimerMasterContainer: FC = () => {
  const phaseState = useSelector<GlobalState, PhaseState|undefined>((state) => state.phaseState);

  const onNextPhase = useCallback(() => {
    if (phaseState === undefined) {
      return () => {};
    }

    const socket = LyricalSocket.instance;
    socket.socket.emit("phase_update", {
      id: Phase.getNextPhase(phaseState.id),
    });
  }, [phaseState]);

  return (
    <TimerMasterComponent
      isLastPhase={phaseState !== undefined && Phase.isLast(phaseState.id)}
      onNextPhase={onNextPhase}
    />
  );
}
