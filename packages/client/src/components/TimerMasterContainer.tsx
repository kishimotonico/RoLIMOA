import { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import type { RootState } from '@rolimoa/common/redux';
import {
  type PhaseState,
  type CurrentPhaseState,
  phaseStateSlice,
} from '@rolimoa/common/redux';
import { operationLogsStateSlice } from '@rolimoa/common/redux';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';
import { LyricalSocket } from '@/lyricalSocket';
import * as Phase from '@/util/PhaseStateUtil';
import { TimerMasterComponent } from './TimerMasterComponent';

function gotoPhaseCommand(
  currentPhase: CurrentPhaseState,
  type: 'first' | 'prev' | 'next' | 'last',
  offset: number,
  isAutoTransition = false,
) {
  let id = currentPhase.id;
  if (type === 'first') id = Phase.getFirstPhase();
  if (type === 'prev') id = Phase.getPrevPhase(currentPhase.id);
  if (type === 'next') id = Phase.getNextPhase(currentPhase.id);
  if (type === 'last') id = Phase.getLastPhase();

  LyricalSocket.dispatchAll([
    phaseStateSlice.actions.setState({
      id,
      startTime: Date.now() + offset,
    }),
    operationLogsStateSlice.actions.addLog({
      op: {
        type: 'PhaseChange',
        phase: id,
        isAuto: isAutoTransition ? true : undefined,
      },
    }),
  ]);
}

// フェーズの自動遷移を行うかを判断
function isAutoTransition(phaseState: PhaseState): boolean {
  const config = Phase.getConfig(phaseState.current.id);
  if (config.type === 'ready') {
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
  if (config.type === 'ready') {
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
    gotoPhaseCommand(currentPhase, 'first', timeOffset);
  }, [currentPhase, timeOffset]);
  const onPrevPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, 'prev', timeOffset);
  }, [currentPhase, timeOffset]);
  const onNextPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, 'next', timeOffset);
  }, [currentPhase, timeOffset]);
  const onLastPhase = useCallback(() => {
    gotoPhaseCommand(currentPhase, 'last', timeOffset);
  }, [currentPhase, timeOffset]);
  const onPauseButton = useCallback(() => {
    const now = Date.now() + timeOffset;
    if (currentPhase.pausedTime) {
      // 再開
      LyricalSocket.dispatchAll([
        phaseStateSlice.actions.setPause({
          pausedTime: undefined,
        }),
        phaseStateSlice.actions.setState({
          id: currentPhase.id,
          startTime: now - (currentPhase.pausedTime - currentPhase.startTime),
        }),
      ]);
    } else {
      // 一時停止
      LyricalSocket.dispatchAll([
        phaseStateSlice.actions.setPause({
          pausedTime: now,
        }),
      ]);
    }
  }, [currentPhase, timeOffset]);

  const onTimeChange = useCallback(
    (ms: number) => () => {
      const startTime = currentPhase.startTime - ms;
      LyricalSocket.dispatchAll([
        phaseStateSlice.actions.setState({
          id: currentPhase.id,
          startTime,
          pausedTime: currentPhase.pausedTime,
        }),
      ]);
    },
    [currentPhase],
  );

  const pausedElapsedSecond = currentPhase.pausedTime
    ? (currentPhase.pausedTime - currentPhase.startTime) / 1000
    : undefined;

  useEffect(() => {
    // タイマーの更新時にフェーズ移行を確認
    if (isAutoTransition(phaseState)) {
      gotoPhaseCommand(phaseState.current, 'next', timeOffset, true);
    }
    // 次フェーズボタンの有効/無効を設定
    setIsEnabledNextButton(isManualTransition(phaseState));
  }, [phaseState, timeOffset]);

  return (
    <TimerMasterComponent
      isFirstPhase={Phase.getIndex(phaseState.current.id) === 0}
      isLastPhase={Phase.isLast(phaseState.current.id)}
      isPaused={phaseState.current.pausedTime !== undefined}
      pausedElapsedSecond={pausedElapsedSecond}
      onFirstPhase={onFirstPhase}
      onPrevPhase={onPrevPhase}
      onNextPhase={onNextPhase}
      onLastPhase={onLastPhase}
      onPauseButton={onPauseButton}
      onTimeChange={onTimeChange}
      isEnabledNextButton={isEnabledNextButton}
      phaseConfig={Phase.getRawConfig(phaseState.current.id)}
      currentPhaseState={phaseState.current}
    />
  );
};
