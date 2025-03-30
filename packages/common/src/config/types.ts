import type { z } from 'zod';
import { configSchema } from './schema/index.js';
import type {
  customControlPanelSchema,
  taskObjectMultiButtonSchema,
  taskObjectToggleButtonSchema,
  taskObjectToggleSwitchSchema,
} from './schema/controlPanel.js';

export type ConfigType = z.infer<typeof configSchema>;

export type TaskObjectConfigType = ConfigType['rule']['task_objects'][number];
export type TimeProgressConfigType = ConfigType['time_progress'][number];

const timerFormatSchema =
  configSchema.shape.time_progress.element.shape.style.unwrap().shape
    .timerFormat;
export type TimeFormat = NonNullable<z.infer<typeof timerFormatSchema>>;

export type CustomControlPanelType = z.infer<typeof customControlPanelSchema>;
export type TaskObjectToggleSwitchUiType = z.infer<
  typeof taskObjectToggleSwitchSchema
>;
export type TaskObjectToggleButtonUiType = z.infer<
  typeof taskObjectToggleButtonSchema
>;
export type taskObjectMultiButtonUiType = z.infer<
  typeof taskObjectMultiButtonSchema
>;
