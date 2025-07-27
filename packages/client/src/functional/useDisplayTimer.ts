import type { TimeProgressConfigType } from '@rolimoa/common/config';
import { createTimeConfigMatcher } from '@rolimoa/common/config/helper';
import type { RootState } from '@rolimoa/common/redux';
import type { PhaseState } from '@rolimoa/common/redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as Phase from '~/util/PhaseStateUtil';
import { formatTime } from '~/util/formatTime';

// 表示する時間の文字列を取得する
function getDisplayString(
  phaseState: PhaseState,
  currentConfig: Required<TimeProgressConfigType>,
): string {
  if (currentConfig.type === 'default') {
    return '----';
  }
  if (currentConfig.type === 'ready') {
    return currentConfig.custom[0]?.displayText ?? 'READY';
  }

  const { config, custom, elapsedSec } = getCustomConfig(phaseState, currentConfig);
  if (custom?.displayText) {
    return custom.displayText;
  }

  let displaySec = Math.min(elapsedSec, config.duration); // 最大時間を超過しないで表示
  if (config.style.timerType === 'countdown') {
    displaySec = config.duration - elapsedSec;
  }

  if (config.style.timerFormat) {
    return formatTime(displaySec, config.style.timerFormat, true);
  }
  return '';
}

// 適用するフェーズ設定や、フェーズ時刻を取得する
function getCustomConfig(phaseState: PhaseState, currentConfig: Required<TimeProgressConfigType>) {
  let applyConfig = currentConfig;
  let elapsedSec = phaseState.elapsedSecond;
  // フェーズ遷移時のちらつき防止のため、本来フェーズ遷移している状況のときは次のフェーズの設定を適用
  if (currentConfig.isAutoTransition && currentConfig.duration <= phaseState.elapsedSecond) {
    const nextPhaseId = Phase.getNextPhase(phaseState.current.id);
    applyConfig = Phase.getConfig(nextPhaseId);
    elapsedSec = 0;
  }
  return {
    config: applyConfig,
    custom: applyConfig.custom.find(createTimeConfigMatcher(elapsedSec, applyConfig.duration)),
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
