import { z } from "zod";
import { cuidSchema, isoDateSchema } from "./schemas";


export const createTimeEntrySchema = z.object ({
    description: z
        .string()
        .max(500, 'Описание не должно превышать 500 символов')
        .trim()
        .optional()
        .default(''),
    
    categoryId: cuidSchema,

    startTime: isoDateSchema,

    endTime: isoDateSchema 
        .nullable()
        .optional(),
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial();

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>;
