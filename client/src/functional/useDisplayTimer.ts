import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { PhaseState } from 'slices/phase';
import * as Phase from 'util/PhaseStateUtil';

// 表示する時間の文字列を取得する
function getDisplayString(phaseState: PhaseState, currentConfig: Required<Phase.TimeProgressConfig>): string {
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
    return formattedTime(displaySec, config.style.timerFormat);
  }
  return "";
}

// 適用するフェーズ設定や、フェーズ時刻を取得する
function getCustomConfig(phaseState: PhaseState, currentConfig: Required<Phase.TimeProgressConfig>) {
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

// 秒数をフォーマット表示した文字列を返す
function formattedTime(second: number, format: string) {
  const m = Math.floor(second / 60);
  const s = second % 60;
  if (format === "mm:ss") {
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  }
  if (format === "m:ss") {
    return `${m.toString().padStart(1, '0')} : ${s.toString().padStart(2, '0')}`;
  }
  if (format === "ss") {
    return second.toString().padStart(2, '0');
  }
  if (format === "s") {
    return second.toString();
  }
  // どれにも一致しないときは "s" と同じく単純に秒数化
  return second.toString();
}

export function useDisplayTimer() {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);

  const config = Phase.getConfig(phaseState.current.id);

  const displayTime = getDisplayString(phaseState, config);
  const description = config.description;

  return {
    displayTime,
    description,
  };
}
