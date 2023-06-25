import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { RootState } from '@/slices';
import { PhaseState, CurrentPhaseState, phaseStateSlice } from '@/slices/phase';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';
import { LyricalSocket } from '@/lyricalSocket';
import * as Phase from '@/util/PhaseStateUtil';
import { TimerMasterComponent } from './TimerMasterComponent';

function gotoPhaseCommand(currentPhase: CurrentPhaseState, type: "first"|"prev"|"next"|"last", offset: number) {
  let id = currentPhase.id;
  if (type === "first")
    id = Phase.getFirstPhase();
  if (type === "prev")
    id = Phase.getPrevPhase(currentPhase.id);
  if (type === "next")
    id = Phase.getNextPhase(currentPhase.id);
  if (type === "last")
    id = Phase.getLastPhase();

  LyricalSocket.dispatchAll([phaseStateSlice.actions.setState({
    id,
    startTime: Date.now() + offset,
  })]);
}

// フェーズの自動遷移を行うかを判断
function isAutoTransition(phaseState: PhaseState): boolean {
  const config = Phase.getConfig(phaseState.current.id);
  if (config.type === "ready") {
    return false;
  }
  if (config.time === undefined || config.isAutoTransition === undefined) {
    return false;
  }
  return config.isAutoTransition && config.time <= phaseState.elapsedSecond; // 比較演算子を `<` にすると1sの猶予ができる
}

// フェーズの手動遷移ボタンの有効/無効
function isManualTransition(phaseState: PhaseState): boolean {
  const config = Phase.getConfig(phaseState.current.id);
  if (Phase.isLast(phaseState.current.id)) {
    return false;
  }
  if (config.type === "ready") {
    return true;
  }
  if (config.isAutoTransition || config.time > phaseState.elapsedSecond) {
    return false;
  }
  return true;
}

export const TimerMasterContainer: FC = () => {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const timeOffset = useRecoilValue(unixtimeOffset);
  const [isEnabledNextButton, setIsEnabledNextButton] = useState(true);

  const currentPhase = phaseState.current;
  const onFirstPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, "first", timeOffset);
  }, [currentPhase, timeOffset]);
  const onPrevPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, "prev", timeOffset);
  }, [currentPhase, timeOffset]);
  const onNextPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, "next", timeOffset);
  }, [currentPhase, timeOffset]);
  const onLastPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, "last", timeOffset);
  }, [currentPhase, timeOffset]);

  useEffect(() => {
    // タイマーの更新時にフェーズ移行を確認
    if (isAutoTransition(phaseState)) {
      gotoPhaseCommand(phaseState.current, "next", timeOffset);
    }
    // 次フェーズボタンの有効/無効を設定
    setIsEnabledNextButton(isManualTransition(phaseState));
  }, [phaseState, timeOffset]);

  return (
    <TimerMasterComponent
      isFirstPhase={Phase.getIndex(phaseState.current.id) === 0}
      isLastPhase={Phase.isLast(phaseState.current.id)}
      onFirstPhase={onFirstPhase}
      onPrevPhase={onPrevPhase}
      onNextPhase={onNextPhase}
      onLastPhase={onLastPhase}
      isEnabledNextButton={isEnabledNextButton}
      phaseConfig={Phase.getRawConfig(phaseState.current.id)}
    />
  );
}
