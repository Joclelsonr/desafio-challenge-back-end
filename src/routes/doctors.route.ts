import { FastifyInstance } from "fastify";
import { makeDoctorsFactory } from "../factories/doctors.factory";

const doctorsController = makeDoctorsFactory();

export async function doctorsRoutes(app: FastifyInstance) {
  app.post("/doctors", doctorsController.createDoctor);
}
