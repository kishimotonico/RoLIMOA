import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import { PhaseState } from '../slices/phase';
import { useRecoilValue } from 'recoil';
import { timerClockState } from '../atoms/timerClockState';
import * as Phase from "../util/PhaseStateUtil";

// 表示する時間の文字列を生成
function _displayTime(elapsedSec: number, config: Required<Phase.TimeProgressConfig>): string {
  if (config.type === "default") {
    return "----";
  }
  if (config.type === "ready") {
    return config.custom[0]?.displayText ?? "READY";
  }

  const custom = config.custom.find(elem => elem.elapsedTime === elapsedSec);
  if (custom?.displayText) {
    return custom.displayText;
  }

  let displaySec = Math.min(elapsedSec, config.time); // 最大時間を超過しないで表示
  if (config.style.timerType === "countdown") {       // カウントダウンする
    displaySec = config.time - elapsedSec;
  }

  const m = Math.floor(displaySec / 60);
  const s = displaySec % 60;
  if (config.style.timerFormat === "mm:ss") {
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  }
  if (config.style.timerFormat === "m:ss") {
    return `${m.toString().padStart(1, '0')} : ${s.toString().padStart(2, '0')}`;
  }
  if (config.style.timerFormat === "s") {
    return displaySec.toString();
  }
  return "-";
}

export function useDisplayTimer() {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const timerClock = useRecoilValue(timerClockState);

  const config = Phase.getConfig(phaseState.id);
  const second = timerClock ?? 0;

  const displayTime = _displayTime(second, config);
  const description = config.description;

  return {
    displayTime,
    description,
  };
}
