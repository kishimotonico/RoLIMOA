import { timingSafeEqual } from "crypto";
import { createTypePredicateNodeWithModifier } from "typescript";

type PhaseState = {
    id: string,
    startTime: number,
};

type TimerConfig = TimerConfigReady|TimerConfigCountup|TimerConfigCountdown;
type TimerConfigBase = {
    id: string,
    type: string,
    description: string,
};
type TimerConfigReady = TimerConfigBase & {
    type: "ready",
};
type TimerConfigCountup = TimerConfigBase & {
    type: "countup",
    time: number,
};
type TimerConfigCountdown = TimerConfigBase & {
    type: "countdown",
    time: number,
};

type ConfigJson = {id: string, type: string, description: string, timer?:number};
export function configHelper(configs: ConfigJson[]): TimerConfig[] {
    return configs.map(config => {
        if (config.type === "ready") {
            return { ...config } as TimerConfigReady;
        }
        if (config.type === "countup") {
            return { ...config } as TimerConfigCountup;
        }
        if (config.type === "countdown") {
            return { ...config } as TimerConfigCountup;
        }
    });
}

export class PhaseManager {
    private static config: TimerConfig[];
    private currentState: PhaseState;
    
    public constructor(currentState: PhaseState) {
        this.currentState = currentState;
    }
    
    public static initializedByConfig(config: TimerConfig[]): PhaseManager {
        PhaseManager.config = config;
        return new PhaseManager({
            id: config[0].id,
            startTime: Date.now(),
        });
    }

    public applyOperation(newState: {
        id: string,
        startTime?: number,
    }): void {
        this.currentState = {
            ...newState,
            startTime: newState.startTime ?? Date.now(),
        };
    }

    public getState(): PhaseState {
        return this.currentState;
    }
}
