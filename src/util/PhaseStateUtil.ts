import config from "../config.json";

// config.jsonでのフェーズ型
export type TimeProgressConfig = {
  id: string,
  type: string, // "ready"|"countup"|"countdown"
  description: string,
  time?: number,
  isAutoTransition?: boolean,
};

export function getIndex(phaseId: string): number {
  return config.time_progress.findIndex(phase => phase.id === phaseId);
}

export function getConfig(phaseId: string): TimeProgressConfig {
  return config.time_progress[getIndex(phaseId)]; // phaseIdが正しいことを信じる
}

export function isLast(phaseId: string): boolean {
  return getIndex(phaseId) + 1 === config.time_progress.length;
}

export function getFirstPhase(): string {
  return config.time_progress[0].id;
}

export function getLastPhase(): string {
  return config.time_progress[-1].id;
}

export function getPrevPhase(phaseId: string): string {
  if (getIndex(phaseId) === 0) {
    return phaseId;
  }
  return config.time_progress[getIndex(phaseId) - 1].id;
}

export function getNextPhase(phaseId: string): string {
  if (isLast(phaseId)) {
    return phaseId;
  }
  return config.time_progress[getIndex(phaseId) + 1].id;
}
