import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/slices";
import { PhaseState } from "@/slices/phase";
import { formatTime } from "@/util/formatTime";
import { TimeProgressConfigType } from "@/config/types";
import * as Phase from "@/util/PhaseStateUtil";
import { MatchState } from "@/slices/match";

// 表示する時間の文字列を取得する
function getDisplayString(
  phaseState: PhaseState,
  match: MatchState,
  currentConfig: Required<TimeProgressConfigType>
): string {
  if (currentConfig.type === "default") {
    return "----";
  }
  if (currentConfig.type === "ready") {
    return currentConfig.custom[0]?.displayText ?? "READY";
  }

  if (currentConfig.type === "matchName") {
    return currentConfig.custom[0]?.displayText ?? match.name;
  }

  if (currentConfig.type === "matchTeamRedName") {
    return currentConfig.custom[0]?.displayText ?? match.teams.red?.name ?? "";
  }

  if (currentConfig.type === "matchTeamBlueName") {
    return currentConfig.custom[0]?.displayText ?? match.teams.blue?.name ?? "";
  }

  const { config, custom, elapsedSec } = getCustomConfig(
    phaseState,
    currentConfig
  );
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
function getCustomConfig(
  phaseState: PhaseState,
  currentConfig: Required<TimeProgressConfigType>
) {
  let applyConfig = currentConfig;
  let elapsedSec = phaseState.elapsedSecond;
  // フェーズ遷移時のちらつき防止のため、本来フェーズ遷移している状況のときは次のフェーズの設定を適用
  if (
    currentConfig.isAutoTransition &&
    currentConfig.time <= phaseState.elapsedSecond
  ) {
    const nextPhaseId = Phase.getNextPhase(phaseState.current.id);
    applyConfig = Phase.getConfig(nextPhaseId);
    elapsedSec = 0;
  }
  return {
    config: applyConfig,
    custom: applyConfig.custom.find((elem) => elem.elapsedTime === elapsedSec),
    elapsedSec,
  };
}

export function useDisplayTimer() {
  const phaseState = useSelector<RootState, PhaseState>((state) => state.phase);
  const match = useSelector<RootState, MatchState>((state) => state.match);

  return useMemo(() => {
    const config = Phase.getConfig(phaseState.current.id);

    const displayTime = getDisplayString(phaseState, match, config);
    const description = config.description;

    return {
      displayTime,
      description,
    };
  }, [phaseState]);
}
