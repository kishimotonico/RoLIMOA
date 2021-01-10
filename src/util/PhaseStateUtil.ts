import config from "../config.json";

// config.jsonでのフェーズ型
type TimeProgressConfig = {
  id: string,
  type: string, // "ready"|"countup"|"countdown"
  description: string,
  time?: number,
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

export function getNextPhase(phaseId: string): string {
  if (isLast(phaseId)) {
    return phaseId;
  }
  return config.time_progress[getIndex(phaseId) + 1].id;
}
