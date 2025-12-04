import z from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  phone: z.string().min(14).max(15),
});

export type PatientCreateInput = z.infer<typeof createPatientSchema>;
