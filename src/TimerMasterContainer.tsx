import React, { FC, useCallback } from 'react';
import { LyricalSocket } from './lyricalSocket';
import { TimerMasterComponent } from './TimerMasterComponent';

export const TimerMasterContainer: FC = () => {
  const onNextPhase = useCallback(() => {
    const socket = LyricalSocket.instance;

    socket.socket.emit("set_next_phase", {});
  }, []);

  return <TimerMasterComponent onNextPhase={onNextPhase} />;
}
