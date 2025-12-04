import { prismaConnection } from "../lib/database";
import { AppointmentsRepository } from "../repositories/appointments.repository";
import { DoctorsRepository } from "../repositories/doctors.repository";
import { PatientsRepository } from "../repositories/patients.repository";
import { MailService } from "../services/mail.service";
import { AppointmentsService } from "../services/appointments.service";
import { AppointmentsController } from "../controllers/appointments.controller";

export function makeAppointmentsFactory() {
  const appointmentsRepository = new AppointmentsRepository(prismaConnection);
  const doctorsRepository = new DoctorsRepository(prismaConnection);
  const patientsRepository = new PatientsRepository(prismaConnection);
  const mailService = new MailService();

  const service = new AppointmentsService(
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
    mailService,
  );

  return new AppointmentsController(service);
}
