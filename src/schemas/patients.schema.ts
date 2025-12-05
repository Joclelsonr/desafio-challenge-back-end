import z from "zod";

import { FastifySchema } from "fastify";

export const createPatientBody = z.object({
  name: z.string().min(3).default("John Doe"),
  email: z.email(),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Invalid phone number. Expected format: (99) 99999-9999",
    ),
});

export const paramsPatientSchema = z.object({
  patientId: z.uuid({ message: "Invalid patient ID" }),
});

export type PatientCreateBody = z.infer<typeof createPatientBody>;
export type PatientParams = z.infer<typeof paramsPatientSchema>;

export const createPatientSchema: FastifySchema = {
  tags: ["Pacientes"],
  summary: "Cadastrar novo paciente",
  description:
    "Este endpoint permite o cadastro de um novo paciente no sistema. Para realizar o registro, é necessário fornecer os dados básicos do paciente, incluindo nome, e-mail e telefone.",
  body: createPatientBody,
  response: {
    201: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      })
      .describe("Created successfully"),
    400: z
      .object({
        statusCode: z.number().default(400),
        error: z.string().default("Validation"),
        message: z.string().default("Validation error name or email or phone"),
      })
      .describe("Validation error"),
    409: z
      .object({
        statusCode: z.number().default(409),
        error: z.string().default("Conflict"),
        message: z.string().default("Patient already exists"),
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

export const findPatientSchema: FastifySchema = {
  tags: ["Pacientes"],
  summary: "Obter paciente por ID, incluindo seus agendamentos",
  description:
    "Este endpoint recupera as informações de um paciente específico a partir de seu identificador único (ID). Além dos dados básicos do paciente como nome, e-mail e telefone, a resposta também inclui a lista de agendamentos associados a ele.",
  params: paramsPatientSchema,
  response: {
    200: z
      .object({
        id: z.uuid(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        appointments: z.array(z.any()),
      })
      .describe("Patient found successfully"),
    404: z
      .object({
        statusCode: z.number().default(404),
        error: z.string().default("Not Found"),
        message: z.string().default("Patient not found"),
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
