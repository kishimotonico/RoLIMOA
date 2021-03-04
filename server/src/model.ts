export type FieldSideType = "blue" | "red";
type TaskObjectsType = { [objectId: string]: number; };
type WholeTaskState = { blue: TaskObjectsType, red: TaskObjectsType };

// export const FieldSideType = {
//     RED: 'RED',
//     BLUE: 'BLUE',
// } as const;

// export interface TaskStatus {
//     [FieldSideType.RED]: TaskObjectsType;
//     [FieldSideType.BLUE]: TaskObjectsType;
// };

type TaskObjectsConfig = {
    id: string;
    description: string;
    initialValue?: number;
    min?: number;
    max?: number;
}[];

export interface UpdateOperation {
    fieldSide: FieldSideType,
    taskObjectId: string;
    afterValue: number;
}

export class TaskStateController {
    public currentState: TaskObjectsType;

    // タスクオブジェクトの設定JSONから初期化
    public static initializeByConfig(configJson: TaskObjectsConfig): TaskStateController {
        const defaultState = Object.fromEntries(configJson.map(taskObj => [taskObj.id, taskObj.initialValue ?? 0]));

        return new TaskStateController(defaultState);
    }

    // from JSON objecat
    public constructor(currentState: TaskObjectsType) {
        this.currentState = currentState;
    }

    // to JSON object
    public toSerialize(): TaskObjectsType {
        return this.currentState;
    }

    public applyOperation(operation: {taskObjectId: string; afterValue: number; }): void {
        if (! this.isContainId(operation.taskObjectId)) {
            throw new Error("ふぇぇ…タスクオブジェクトIDの参照エラーだよぉ");
        }

        this.currentState[operation.taskObjectId] = operation.afterValue;
    }

    private isContainId(findId: string): boolean {
        const ids = Object.keys(this.currentState);
        return ids.includes(findId);
    }
}

export class WholeTaskStateController {
    public currentState: { [fieldSide in FieldSideType]: TaskStateController; };

    // タスクオブジェクトの設定JSONから初期化
    public static initializeByConfig(configJson: TaskObjectsConfig): WholeTaskStateController {
        const serializedDefault = {
            blue: TaskStateController.initializeByConfig(configJson).toSerialize(),
            red: TaskStateController.initializeByConfig(configJson).toSerialize(),
        };

        return new WholeTaskStateController(serializedDefault);
    }

    // from JSON objecat
    public constructor(currentState: WholeTaskState) {
        this.currentState = {
            red: new TaskStateController(currentState.red),
            blue: new TaskStateController(currentState.blue),
        };
    }

    // to JSON object
    public toSerialize() {
        return {
            blue: this.currentState.blue.toSerialize(),
            red: this.currentState.red.toSerialize(),
        };
    }

    public applyOperation({fieldSide, ...rest}: UpdateOperation): void {
        this.currentState[fieldSide].applyOperation(rest);
    }
}
