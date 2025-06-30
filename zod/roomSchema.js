const { z } = require('zod');

const roomSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  features: z.array(z.string()).optional(),
  rules: z.object({
    maxDurationMinutes: z.number().int().positive(),
    allowWeekends: z.boolean(),
    minAdvanceHours: z.number().int().nonnegative(),
  }).optional(),
});

module.exports = roomSchema;
