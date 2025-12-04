import { z } from "zod";

export const createAppointmentBodySchema = z.object({
  patientId: z.uuid(),
  doctorId: z.uuid(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
});

export const paramsAppointmentSchema = z.object({
  appointmentId: z.uuid({ message: "Invalid appointment ID" }),
});

export type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;
export type ParamsAppointmentSchema = z.infer<typeof paramsAppointmentSchema>;
