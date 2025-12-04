import z from "zod";

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const createDoctorSchema = z.object({
  name: z.string().min(3),
  specialty: z.string().min(3),
  price: z.number().positive(),
});

export const paramsScheduleSchema = z.object({
  doctorId: z.uuid({ message: "Invalid doctor ID" }),
});

export const createScheduleBodySchema = z
  .object({
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z
      .string()
      .regex(timeRegex, "Invalid time format. Use HH:mm (e.g., 08:00)"),
    availableToTime: z
      .string()
      .regex(timeRegex, "Invalid time format. Use HH:mm (e.g., 18:00)"),
  })
  .refine((data) => data.availableToWeekDay >= data.availableFromWeekDay, {
    message: "End day cannot be before start day",
    path: ["availableToWeekDay"],
  })
  .refine((data) => data.availableToTime > data.availableFromTime, {
    message: "End time must be after start time",
    path: ["availableToTime"],
  });

export type DoctorCreateInput = z.infer<typeof createDoctorSchema>;
export type CreateScheduleBody = z.infer<typeof createScheduleBodySchema>;
