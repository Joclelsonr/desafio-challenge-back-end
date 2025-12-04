import { prismaConnection } from "../lib/database";
import { AppointmentsRepository } from "../repositories/appointments.repository";
import { DoctorsRepository } from "../repositories/doctors.repository";
import { PatientsRepository } from "../repositories/patients.repository";
import { AppointmentsService } from "../services/appointments.service";
import { AppointmentsController } from "../controllers/appointments.controller";

export function makeAppointmentsFactory() {
  const appointmentsRepository = new AppointmentsRepository(prismaConnection);
  const doctorsRepository = new DoctorsRepository(prismaConnection);
  const patientsRepository = new PatientsRepository(prismaConnection);

  const service = new AppointmentsService(
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
  );

  return new AppointmentsController(service);
}
