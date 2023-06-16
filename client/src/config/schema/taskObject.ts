import { z } from 'zod';

export const taskObjectSchema = z.object({
  id: z.string(),
  description: z.string(),
  initialValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});
