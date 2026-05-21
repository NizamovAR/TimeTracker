import z from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Название категории обязательно')
        .max(70, 'Название не должно превышать 70 символов')
        .trim(),
    
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Цвет должен быть в формате HEX (#RRGGBB)')
        .optional()
        .default('#3b82f6'),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof createCategorySchema>;
