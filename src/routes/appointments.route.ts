import { FastifyInstance } from "fastify";
import { makeAppointmentsFactory } from "../factories/appointments.factory";

const appointmentsController = makeAppointmentsFactory();

export function appointmentsRoutes(app: FastifyInstance) {
  app.post("/appointments", appointmentsController.create);
}
