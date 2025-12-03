import { prismaConnection } from "../lib/database";
import { PatientsRepository } from "../repositories/patients.repository";
import { PatientsService } from "../services/patients.service";
import { PatientsController } from "../controllers/patients.controller";

export function makePatientsFactory() {
  const patientsRepository = new PatientsRepository(prismaConnection);
  const patientsService = new PatientsService(patientsRepository);
  const patientsController = new PatientsController(patientsService);

  return patientsController;
}
