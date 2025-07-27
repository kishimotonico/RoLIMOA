import { z } from 'zod';
import { customControlPanelSchema } from './controlPanel.js';
import { taskObjectSchema } from './taskObject.js';

const vgoalConditionSchema = z.union([
  z.object({
    type: z.literal('manual'),
    required: z.object({
      tasks: z.array(
        z.object({
          id: z.string(),
          count: z.number(),
        }),
      ),
    }),
  }),
  z.object({
    type: z.literal('alwaysOk'),
  }),
  z.object({
    type: z.literal('disabled'),
  }),
  z.object({
    type: z.literal('implement'),
  }),
]);

const timeProgressSchema = z.object({
  id: z.string(),
  type: z.enum(['default', 'ready', 'count']),
  duration: z.number().optional(),
  description: z.string(),
  isAutoTransition: z.boolean().optional(),
  style: z
    .object({
      timerFormat: z.enum(['mm:ss', 'm:ss', 'ss', 's']).optional(),
      timerType: z.string().optional(),
    })
    .optional(),
  custom: z
    .array(
      z.object({
        elapsedTime: z.union([z.number(), z.string().regex(/^L-\d+$/)]),
        displayText: z.string().optional(),
        sound: z.string().optional(),
      }),
    )
    .optional(),
});

export const configSchema = z.object({
  contest_info: z.object({
    name: z.string(),
  }),
  rule: z.object({
    global_objects: z.array(taskObjectSchema),
    task_objects: z.array(taskObjectSchema),
    score: z.union([
      z.object({
        format: z.literal('simple'),
        expression: z.array(
          z.object({
            id: z.string(),
            coefficient: z.number(),
          }),
        ),
      }),
      z.object({
        format: z.literal('formulaExpression'),
        expression: z.any(), // 再帰構造を含むのでとりあえずany
      }),
      z.object({
        format: z.literal('implement'),
      }),
    ]),
    vgoal: z.object({
      name: z.string(),
      condition: vgoalConditionSchema,
    }),
    control_panel: z.union([
      z.object({
        type: z.literal('default'),
      }),
      z.object({
        type: z.literal('custom'),
        panels: z.array(customControlPanelSchema).optional(),
      }),
    ]),
  }),
  time_progress: z.array(timeProgressSchema),
  teams_info: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      school: z.string(),
      short: z.string(),
    }),
  ),
  client: z.object({
    standalone_mode: z.boolean(),
  }),
  option: z.object({
    truncate_millisec_on_pause: z.boolean().optional(),
  }),
});
