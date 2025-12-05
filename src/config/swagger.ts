import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: "Medical Appointment API",
      description:
        "API de gerenciamento de clínica médica desenvolvida com Fastify e Clean Architecture.",
      version: "0.0.1",
      contact: {
        name: "Equipe de Backend",
        email: "dev@medical.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  transform: jsonSchemaTransform,
};

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};
