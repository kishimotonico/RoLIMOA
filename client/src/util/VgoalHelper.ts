import { config as rootConfig } from '@/config/load';
import { CurrentMatchStateType } from './currentMatchStateType';
import { condition } from '@/custom/rule.vgoal';

// Vゴールが可能な状況かを判断する
export function isVgoalAvailable(currentMatchState: CurrentMatchStateType): boolean {
  const vgoalCondition = rootConfig.rule.vgoal.condition;

  // type: manual
  if (vgoalCondition.type === "manual") {
    const requiredTasks = vgoalCondition.required.tasks;
    const taskObjects =  currentMatchState.taskObjects;
    return requiredTasks.every((requiredTask) => taskObjects[requiredTask.id] >= requiredTask.count);
  }

  // type: alwaysOk
  if (vgoalCondition.type === "alwaysOk") {
    return true;
  }

  // type: implement
  if (vgoalCondition.type === "implement") {
    return condition(currentMatchState) ?? true;
  }

  return true;
}
