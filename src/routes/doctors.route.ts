import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { makeDoctorsFactory } from "../factories/doctors.factory";
import {
  createDoctorSwaggerSchema,
  createScheduleSwaggerSchema,
} from "../schemas/doctors.schema";

const doctorsController = makeDoctorsFactory();

export async function doctorsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/doctors",
      { schema: createDoctorSwaggerSchema },
      doctorsController.createDoctor,
    );

  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/doctors/:doctorId/schedule",
      { schema: createScheduleSwaggerSchema },
      doctorsController.createSchedule,
    );
}
