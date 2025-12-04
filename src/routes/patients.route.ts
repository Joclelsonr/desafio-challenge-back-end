import { FastifyInstance } from "fastify";
import { makePatientsFactory } from "../factories/patients.factory";

const patientsController = makePatientsFactory();

export async function patientsRoutes(app: FastifyInstance) {
  app.post("/patients", patientsController.create);
  app.get("/patients/:patientId", patientsController.findOne);
}
