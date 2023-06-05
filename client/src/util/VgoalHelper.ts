import { ScoreStateType } from "../slices/score";
import { config as rootConfig } from 'config/load';

// この型定義でJSONを扱えれば便利なのだけど……
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VgoalInfoType = {
  name: string,                   // Vゴール名称
  condition: VgoalConditionType,  // Vゴールを達成する条件
};
type VgoalConditionType = ManualConditionType | AlwaysOkConditionType;
type ManualConditionType = {
  type: "manual",
  required: {
    tasks: {
      id: string,
      count: number,
    }[],
  },
};
type AlwaysOkConditionType = {
  type: "alwaysOk",
}

function isManualConditionType(arg: any): arg is ManualConditionType {
  return arg.type === "manual";
}
function isAlwaysOkConditionType(arg: any): arg is AlwaysOkConditionType {
  return arg.type === "alwaysOk";
}

// Vゴールが可能な状況かを判断する
export function isVgoalAvailable(scoreState: ScoreStateType): boolean {
  const vgoalCondition = rootConfig.rule.vgoal.condition as VgoalConditionType;

  // type: manual
  if (isManualConditionType(vgoalCondition)) {
    const requiredTasks = vgoalCondition.required.tasks;
    return requiredTasks.every((requiredTask) => scoreState.tasks[requiredTask.id] >= requiredTask.count);
  }

  // type: alwaysOk
  console.assert(isAlwaysOkConditionType(vgoalCondition));
  return true;
}
