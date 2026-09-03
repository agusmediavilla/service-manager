import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(1, 'name es obligatorio'),
  description: z.string().trim().min(1, 'description es obligatorio'),
  duration: z.number().positive('duration debe ser mayor a 0'),
  price: z.number().nonnegative('price no puede ser negativo'),
  category: z.string().trim().min(1, 'category es obligatorio'),
  available: z.boolean()
}).strict();

export const updateServiceSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  duration: z.number().positive().optional(),
  price: z.number().nonnegative().optional(),
  category: z.string().trim().min(1).optional(),
  available: z.boolean().optional()
}).strict();
