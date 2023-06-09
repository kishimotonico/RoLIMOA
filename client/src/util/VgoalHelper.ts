import { FieldScoreStateType } from "../slices/score";
import { config as rootConfig } from 'config/load';

// Vゴールが可能な状況かを判断する
export function isVgoalAvailable(scoreState: FieldScoreStateType): boolean {
  const vgoalCondition = rootConfig.rule.vgoal.condition;

  // type: manual
  if (vgoalCondition.type === "manual") {
    const requiredTasks = vgoalCondition.required.tasks;
    return requiredTasks.every((requiredTask) => scoreState.tasks[requiredTask.id] >= requiredTask.count);
  }

  // type: alwaysOk
  console.assert(vgoalCondition.type === "alwaysOk");
  return true;
}
