import { FastifyInstance } from "fastify";
import { makePatientsFactory } from "../factories/patients.factory";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createPatientSchema,
  findPatientSchema,
} from "../schemas/patients.schema";

const patientsController = makePatientsFactory();

export async function patientsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/patients",
      { schema: createPatientSchema },
      patientsController.create,
    );

  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/patients/:patientId",
      { schema: findPatientSchema },
      patientsController.findOne,
    );
}
