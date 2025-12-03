import { prismaConnection } from "../lib/database";
import { DoctorsRepository } from "../repositories/doctors.repository";
import { DoctorsService } from "../services/doctors.service";
import { DoctorsController } from "../controllers/doctors.controller";

export function makeDoctorsFactory() {
  const doctorsRepository = new DoctorsRepository(prismaConnection);
  const doctorsService = new DoctorsService(doctorsRepository);
  const doctorsController = new DoctorsController(doctorsService);

  return doctorsController;
}
