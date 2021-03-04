import config from "../config.json";

// config.jsonでのフェーズ型
export type TimerStyleConfig = {
  timerFormat?: string,
  timerType?: string,
};

export type TimerCustomConfig = {
  elapsedTime: number,
  displayText?: string,
  sound?: string,
};

export type TimeProgressConfig = {
  id: string,
  type: string, // "ready"|"count"
  description: string,
  time?: number,
  isAutoTransition?: boolean,
  style?: TimerStyleConfig,
  custom?: TimerCustomConfig[],
};

const defaultConfig = {
  id: "default",
  type: "ready",
  description: "",
  time: Number.MAX_SAFE_INTEGER,
  isAutoTransition: false,
  style: {
    timerFormat: "s",
    timerType: "countup",
  },
  custom: [],
}

export function getIndex(phaseId?: string): number {
  if (phaseId === undefined || phaseId === "default") {
    return 0;
  }
  return config.time_progress.findIndex(phase => phase.id === phaseId);
}

export function getConfig(phaseId?: string): Required<TimeProgressConfig> {
  if (phaseId === undefined || phaseId === "default") {
    return defaultConfig;
  }
  return {
    ...defaultConfig,
    ...config.time_progress[getIndex(phaseId)],
  };
}

export function getRawConfig(phaseId: string): TimeProgressConfig {
  if (phaseId === "default") {
    return defaultConfig;
  }
  return config.time_progress[getIndex(phaseId)];
}

export function isLast(phaseId: string): boolean {
  if (phaseId === "default") {
    return true;
  }
  return getIndex(phaseId) + 1 === config.time_progress.length;
}

export function getFirstPhase(): string {
  return config.time_progress[0].id;
}

export function getLastPhase(): string {
  return config.time_progress[config.time_progress.length - 1].id;
}

export function getPrevPhase(phaseId: string): string {
  if (phaseId === "default" || getIndex(phaseId) === 0) {
    return phaseId;
  }
  return config.time_progress[getIndex(phaseId) - 1].id;
}

export function getNextPhase(phaseId: string): string {
  if (phaseId === "default" || isLast(phaseId)) {
    return phaseId;
  }
  return config.time_progress[getIndex(phaseId) + 1].id;
}
