import { FastifyInstance } from "fastify";
import { makeAppointmentsFactory } from "../factories/appointments.factory";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  cancelAppointmentSwaggerSchema,
  createAppointmentSwaggerSchema,
} from "../schemas/appointments.schema";

const appointmentsController = makeAppointmentsFactory();

export function appointmentsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/appointments",
      { schema: createAppointmentSwaggerSchema },
      appointmentsController.create,
    );

  app.patch(
    "/appointments/:appointmentId/cancel",
    { schema: cancelAppointmentSwaggerSchema },
    appointmentsController.cancel,
  );
}
