import { z } from "zod";
import { configSchema } from "./schema";

export type ConfigType = z.infer<typeof configSchema>;

export type TaskObjectConfigType = ConfigType["rule"]["task_objects"][number];
export type TimeProgressConfigType = ConfigType["time_progress"][number];

const timerFormatSchema = configSchema.shape.time_progress.element.shape.style.unwrap().shape.timerFormat;
export type TimeFormat = NonNullable<z.infer<typeof timerFormatSchema>>;
