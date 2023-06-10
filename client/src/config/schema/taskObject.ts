import { z } from "zod";

export const taskObjectNormalButtonSchema = z.object({
  type: z.literal("normal_button"),
  option: z.never(), // TODO: 気が向いたら通常のボタンUIにもカスタムをつける
});

export const taskObjectToggleSwitchSchema = z.object({
  type: z.literal("toggle_switch"),
  option: z.object({
    off_value: z.number(),
    on_value: z.number(),
  }),
});

const colorSchema = z.enum(["standard", "primary", "secondary", "error", "info", "success", "warning"]);
export const taskObjectToggleButtonSchema = z.object({
  type: z.literal("toggle_button"),
  option: z.object({
    buttons: z.array(
      z.object({
        value: z.number(),
        label: z.string(),
        style: z.object({
          color: colorSchema.optional(),
        }).optional(),
      }),
    ),
    vertical: z.boolean().optional(),
  }),
});

export const taskObjectSchema = z.object({
  id: z.string(),
  description: z.string(),
  initialValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  ui: z.union([
    taskObjectNormalButtonSchema,
    taskObjectToggleSwitchSchema,
    taskObjectToggleButtonSchema,
  ]).optional(),
});
