import z from "zod";

import { FastifySchema } from "fastify";

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const createDoctorBodySchema = z.object({
  name: z.string().min(3, "Invalid name, minimum 3 characters"),
  specialty: z.string().min(3, "Invalid specialty, minimum 3 characters "),
  price: z.number().positive("Invalid price, must be a positive number"),
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

export type CreateDoctorBody = z.infer<typeof createDoctorBodySchema>;
export type CreateScheduleBody = z.infer<typeof createScheduleBodySchema>;

export const createDoctorSwaggerSchema: FastifySchema = {
  tags: ["Médicos"],
  summary: "Cadastrar novo médico",
  description:
    "Este endpoint realiza o cadastro de um novo médico no sistema. Para criar o registro, é necessário fornecer informações básicas como nome, valor da consulta e especialidade médica.",
  body: createDoctorBodySchema,
  response: {
    201: z
      .object({
        id: z.string(),
        name: z.string(),
        specialty: z.string(),
        price: z
          .any()
          .transform((val) => Number(val))
          .pipe(z.number()),
      })
      .describe("Created successfully"),
    400: z
      .object({
        statusCode: z.number().default(400),
        error: z.string().default("Validation"),
        message: z
          .string()
          .default("Validation error name or specialty or price"),
      })
      .describe("Validation error"),
    500: z
      .object({
        statusCode: z.number().default(500),
        error: z.string().default("Server Error"),
        message: z.string().default("Internal server error"),
      })
      .describe("Internal server error"),
  },
};

export const createScheduleSwaggerSchema: FastifySchema = {
  tags: ["Médicos"],
  summary: "Criar agenda médica",
  description:
    "Este endpoint permite criar uma nova agenda médica vinculada a um doutor específico. Para registrar a agenda, é necessário fornecer: - Dia da semana: representado por um número inteiro de 0 a 6, onde 0 representa domingo, 1 representa segunda-feira, etc. - Hora inicial: representada pelo formato HH:mm (e.g., 08:00) - Hora final: representada pelo formato HH:mm (e.g., 18:00)",
  body: createScheduleBodySchema,
  response: {
    201: z
      .object({
        id: z.string(),
        availableFromWeekDay: z.number(),
        availableToWeekDay: z.number(),
        availableFromTime: z.string(),
        availableToTime: z.string(),
      })
      .describe("Created successfully"),
    400: z
      .object({
        statusCode: z.number().default(400),
        error: z.string().default("Validation"),
        message: z
          .string()
          .default(
            "Validation error availableFromWeekDay or availableToWeekDay or availableFromTime or availableToTime",
          ),
      })
      .describe("Validation error"),
    404: z
      .object({
        statusCode: z.number().default(404),
        error: z.string().default("Not Found"),
        message: z.string().default("Doctor not found"),
      })
      .describe("Not found error"),
    409: z
      .object({
        statusCode: z.number().default(409),
        error: z.string().default("Conflict"),
        message: z
          .string()
          .default("This schedule conflicts with an existing one."),
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
