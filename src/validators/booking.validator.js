import { z } from 'zod';

export const createBookingSchema = z.object({
  clientName: z.string().trim().min(1, 'clientName es obligatorio'),
  clientEmail: z.string().email('clientEmail debe ser un email válido'),
  date: z.string().trim().min(1, 'date es obligatorio'),
  time: z.string().trim().min(1, 'time es obligatorio'),
  status: z.string().trim().min(1, 'status es obligatorio')
}).strict();

export const addServiceToBookingSchema = z.object({
  bid: z.string().trim().min(1, 'bid es obligatorio'),
  sid: z.string().trim().min(1, 'sid es obligatorio')
});
