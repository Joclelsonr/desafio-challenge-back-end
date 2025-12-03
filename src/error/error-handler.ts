import { ZodError } from "zod";
import { FastifyInstance } from "fastify";
import { AppError } from "./app.error";
import { STATUS_CODES } from "node:http";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: STATUS_CODES[400],
      message: "Validation error",
      issues: error.flatten().fieldErrors,
    });
  }

  if (error instanceof AppError) {
    const errorType = STATUS_CODES[error.statusCode] || "Unknown Error";

    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: errorType,
      message: error.message,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // Em produção, podemos exibir o erro e logue em ferramenta externa (Datadog/Sentry)
    // TODO: Enviar para Datadog/Sentry
  }

  return reply.status(500).send({
    statusCode: 500,
    error: STATUS_CODES[500],
    message: "Internal server error",
  });
};
