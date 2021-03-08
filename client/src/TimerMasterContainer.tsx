import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, PhaseState, phaseStateSlice } from './store';
import { LyricalSocket } from './lyricalSocket';
import { TimerMasterComponent } from './TimerMasterComponent';
import * as Phase from "./util/PhaseStateUtil";

function gotoPhaseCommand(currentPhase: PhaseState, type: "first"|"prev"|"next"|"last") {
  let id = currentPhase.id;
  if (type === "first")
    id = Phase.getFirstPhase();
  if (type === "prev")
    id = Phase.getPrevPhase(currentPhase.id);
  if (type === "next")
    id = Phase.getNextPhase(currentPhase.id);
  if (type === "last")
    id = Phase.getLastPhase();

  const socket = LyricalSocket.instance.socket;
  socket.emit("dispatch", phaseStateSlice.actions.setCurrent({
    id,
    startTime: 0,   // dummy
  }));
}

// フェーズの自動遷移を行うかを判断
function isAutoTransition(currentPhase: PhaseState, elapsedSecond: number): boolean {
  const config = Phase.getConfig(currentPhase.id);
  if (config.type === "ready") {
    return false;
  }
  if (config.time === undefined || config.isAutoTransition === undefined) {
    return false;
  }
  return config.isAutoTransition && config.time <= elapsedSecond; // 比較演算子を `<` にすると1sの猶予ができる
}

// フェーズの手動遷移ボタンの有効/無効
function isManualTransition(currentPhase: PhaseState, elapsedSecond: number): boolean {
  const config = Phase.getConfig(currentPhase.id);
  if (Phase.isLast(currentPhase.id)) {
    return false;
  }
  if (config.type === "ready") {
    return true;
  }
  if (config.isAutoTransition || config.time > elapsedSecond) {
    return false;
  }
  return true;
}

export const TimerMasterContainer: FC = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const [isEnabledNextButton, setIsEnabledNextButton] = useState(true);
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

  const onTick = useCallback((elapsedSecond: number) => {
    // タイマーの更新時にフェーズ移行を確認
    if (isAutoTransition(phaseState, elapsedSecond)) {
      gotoPhaseCommand(phaseState, "next");
    }
    // 次フェーズボタンの有効/無効を設定
    setIsEnabledNextButton(isManualTransition(phaseState, elapsedSecond));
  }, [phaseState]);

  return (
    <TimerMasterComponent
      onTick={onTick}
      isFirstPhase={Phase.getIndex(phaseState.id) === 0}
      isLastPhase={Phase.isLast(phaseState.id)}
      onFirstPhase={onFirstPhase}
      onPrevPhase={onPrevPhase}
      onNextPhase={onNextPhase}
      onLastPhase={onLastPhase}
      isEnabledNextButton={isEnabledNextButton}
      phaseConfig={Phase.getRawConfig(phaseState.id)}
    />
  );
}
