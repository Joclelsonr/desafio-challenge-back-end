import { z } from "zod";
import { FastifySchema } from "fastify";

export const createAppointmentBodySchema = z.object({
  patientId: z.uuid(),
  doctorId: z.uuid(),
  date: z.coerce.date().default(new Date()),
});

export const paramsAppointmentSchema = z.object({
  appointmentId: z.uuid({ message: "Invalid appointment ID" }),
});

export type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;
export type ParamsAppointmentSchema = z.infer<typeof paramsAppointmentSchema>;

export const createAppointmentSwaggerSchema: FastifySchema = {
  tags: ["Agendamentos"],
  summary: "Cadastrar novo agendamento com médico",
  description:
    "Este endpoint permite o cadastro de um novo agendamento com um médico no sistema. Para realizar o registro, é necessário fornecer os dados básicos do agendamento, incluindo paciente, médico, data e hora.",
  body: createAppointmentBodySchema,
  response: {
    201: z
      .object({
        id: z.string(),
        patientId: z.string(),
        doctorId: z.string(),
        createdAt: z.date(),
      })
      .describe("Created successfully"),
    400: z
      .object({
        statusCode: z.number().default(400),
        error: z.string().default("Validation"),
        message: z.string().default("Invalid date or doctor is not available"),
      })
      .describe("Validation error"),
    404: z
      .object({
        statusCode: z.number().default(404),
        error: z.string().default("Not Found"),
        message: z.string().default("Patient or doctor not found"),
      })
      .describe("Not found error"),
    409: z
      .object({
        statusCode: z.number().default(409),
        error: z.string().default("Conflict"),
        message: z.string().default("Appointment already exists"),
      })
      .describe("Conflict error"),
    500: z
      .object({
        statusCode: z.number().default(500),
        error: z.string().default("Server Error"),
        message: z.string().default("Internal server error"),
      })
      .describe("Internal server error"),
  },
};

export const cancelAppointmentSwaggerSchema: FastifySchema = {
  tags: ["Agendamentos"],
  summary: "Cancelar agendamento",
  description:
    "Este endpoint permite o cancelamento de um agendamento no sistema. Para realizar o cancelamento, é necessário fornecer o ID do agendamento. Só é possível cancelar consultas com pelo menos 2 horas de antecedência.",
  params: paramsAppointmentSchema,
  response: {
    204: z
      .object({
        message: z.string().default("Appointment canceled successfully"),
      })
      .describe("Canceled successfully"),
    400: z
      .object({
        statusCode: z.number().default(400),
        error: z.string().default("Validation"),
        message: z
          .string()
          .default(
            "Appointments already canceled or outside of scheduled hours",
          ),
      })
      .describe("Validation error"),
    404: z
      .object({
        statusCode: z.number().default(404),
        error: z.string().default("Not Found"),
        message: z.string().default("Appointment not found"),
      })
      .describe("Not found error"),
    500: z
      .object({
        statusCode: z.number().default(500),
        error: z.string().default("Server Error"),
        message: z.string().default("Internal server error"),
      })
      .describe("Internal server error"),
  },
};
