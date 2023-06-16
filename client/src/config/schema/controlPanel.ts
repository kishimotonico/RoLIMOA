import { z } from "zod";

const commonStyleSchema = z.object({
  width: z.number().optional(),
});

const commonSchema = {
  id: z.string(),
  style: commonStyleSchema.optional(),
};

export const taskObjectToggleSwitchSchema = z.object({
  ...commonSchema,
  type: z.literal("toggle_switch"),
  option: z.object({
    off_value: z.number(),
    on_value: z.number(),
  }),
});

const colorSchema = z.enum(["standard", "primary", "secondary", "error", "info", "success", "warning"]);
export const taskObjectToggleButtonSchema = z.object({
  ...commonSchema,
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
  style: commonStyleSchema.optional(),
});

export const customControlPanelSchema = z.union([
  taskObjectToggleButtonSchema,
  taskObjectToggleSwitchSchema,
]);
