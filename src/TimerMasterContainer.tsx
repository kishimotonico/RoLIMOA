import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PhaseState } from './reducer';
import { LyricalSocket } from './lyricalSocket';
import { TimerMasterComponent } from './TimerMasterComponent';
import * as Phase from "./util/PhaseStateUtil";

function gotoPhaseCommand(currentPhase: PhaseState|undefined, type: "first"|"prev"|"next"|"last") {
  if (currentPhase === undefined) {
    return;
  }

  let id = currentPhase.id;
  if (type === "first")
  id = Phase.getFirstPhase();
  if (type === "prev")
    id = Phase.getPrevPhase(currentPhase.id);
  if (type === "next")
    id = Phase.getNextPhase(currentPhase.id);
  if (type === "last")
    id = Phase.getLastPhase();

  const socket = LyricalSocket.instance;
  socket.socket.emit("phase_update", { id: id });
}

// フェーズの自動遷移を行うかを判断
function isAutoTransition(currentPhase: PhaseState|undefined, elapsedSecond: number): boolean {
  if (currentPhase === undefined) {
    return false;
  }

  const config = Phase.getConfig(currentPhase.id);
  if (config.type === "ready") {
    return false;
  }
  if (config.time === undefined || config.isAutoTransition === undefined) {
    return false;
  }
  return config.isAutoTransition && config.time <= elapsedSecond; // 比較演算子を `<` にすると1sの猶予ができる
}

export const TimerMasterContainer: FC = () => {
  const phaseState = useSelector<GlobalState, PhaseState|undefined>((state) => state.phaseState);
  const onFirstPhase = useCallback(() => {
    gotoPhaseCommand(phaseState, "first")
  }, [phaseState]);
  const onPrevPhase = useCallback(() => {
    gotoPhaseCommand(phaseState, "prev")
  }, [phaseState]);
  const onNextPhase = useCallback(() => {
    gotoPhaseCommand(phaseState, "next")
  }, [phaseState]);
  const onLastPhase = useCallback(() => {
    gotoPhaseCommand(phaseState, "last")
  }, [phaseState]);

  // タイマーの更新時にフェーズ移行を確認
  const onTick = useCallback((elapsedSecond: number) => {
    if (isAutoTransition(phaseState, elapsedSecond)) {
      gotoPhaseCommand(phaseState, "next");
    }
  }, [phaseState]);

  if (phaseState === undefined) {
    return <></>;
  }

  return (
    <TimerMasterComponent
      onTick={onTick}
      isFirstPhase={Phase.getIndex(phaseState.id) === 0}
      isLastPhase={Phase.isLast(phaseState.id)}
      onFirstPhase={onFirstPhase}
      onPrevPhase={onPrevPhase}
      onNextPhase={onNextPhase}
      onLastPhase={onLastPhase}
      isEnabledNextButton={true} // 今は次へボタンを有効にしておく
      phaseConfig={Phase.getConfig(phaseState.id)}
    />
  );
}
