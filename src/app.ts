import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { swaggerConfig, swaggerUiConfig } from "./config/swagger";

import { patientsRoutes } from "./routes/patients.route";
import { doctorsRoutes } from "./routes/doctors.route";
import { appointmentsRoutes } from "./routes/appointments.route";
import { errorHandler } from "./error/error-handler";

export const app = fastify({
  logger: { transport: { target: "pino-pretty" } },
});

// Middlewares
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Cors
app.register(fastifyCors, { origin: "*" });

// Swagger
app.register(fastifySwagger, swaggerConfig);
app.register(fastifySwaggerUi, swaggerUiConfig);

// Rotas
app.register(patientsRoutes);
app.register(doctorsRoutes);
app.register(appointmentsRoutes);

// Error handler
app.setErrorHandler(errorHandler);
