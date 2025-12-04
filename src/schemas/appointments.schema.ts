import { z } from "zod";

export const createAppointmentBodySchema = z.object({
  patientId: z.uuid(),
  doctorId: z.uuid(),
  createdAt: z.string().datetime(),
});

export type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;
