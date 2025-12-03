import { ZodError } from "zod";
import { FastifyInstance } from "fastify";
import { AppError } from "./app.error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
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
    message: "Internal server error",
  });
};
