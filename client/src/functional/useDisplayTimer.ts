import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import { formatTime } from 'util/formatTime';
import { TimeProgressConfigType } from 'config/types';
import * as Phase from 'util/PhaseStateUtil';

// 表示する時間の文字列を取得する
function getDisplayString(phaseState: PhaseState, currentConfig: Required<TimeProgressConfigType>): string {
  if (currentConfig.type === "default") {
    return "----";
  }
  if (currentConfig.type === "ready") {
    return currentConfig.custom[0]?.displayText ?? "READY";
  }

  const { config, custom, elapsedSec } = getCustomConfig(phaseState, currentConfig);
  if (custom?.displayText) {
    return custom.displayText;
  }

  let displaySec = Math.min(elapsedSec, config.time); // 最大時間を超過しないで表示
  if (config.style.timerType === "countdown") {
    displaySec = config.time - elapsedSec;
  }

  if (config.style.timerFormat) {
    return formatTime(displaySec, config.style.timerFormat, true);
  }
  return "";
}

// 適用するフェーズ設定や、フェーズ時刻を取得する
function getCustomConfig(phaseState: PhaseState, currentConfig: Required<TimeProgressConfigType>) {
  let applyConfig = currentConfig;
  let elapsedSec = phaseState.elapsedSecond;
  // フェーズ遷移時のちらつき防止のため、本来フェーズ遷移している状況のときは次のフェーズの設定を適用
  if (currentConfig.isAutoTransition && currentConfig.time <= phaseState.elapsedSecond) {
    const nextPhaseId = Phase.getNextPhase(phaseState.current.id);
    applyConfig = Phase.getConfig(nextPhaseId);
    elapsedSec = 0;
  }
  return {
    config: applyConfig,
    custom: applyConfig.custom.find(elem => elem.elapsedTime === elapsedSec),
    elapsedSec,
  };
}

export function useDisplayTimer() {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  return useMemo(() => {
    const config = Phase.getConfig(phaseState.current.id);
  
    const displayTime = getDisplayString(phaseState, config);
    const description = config.description;
  
    return {
      displayTime,
      description,
    };
  }, [phaseState]);
}
